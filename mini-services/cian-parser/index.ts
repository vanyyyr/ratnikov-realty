console.log("[cian-parser] Starting on port 3080");

const server = Bun.serve({
  port: 3080,
  async fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === "/parse" && req.method === "GET") {
      const targetUrl = url.searchParams.get("url");
      if (!targetUrl) {
        return new Response(JSON.stringify({ error: "Missing url parameter" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      try {
        const res = await fetch(targetUrl, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml",
            "Accept-Language": "ru-RU,ru;q=0.9",
          },
          signal: AbortSignal.timeout(10000),
        });

        if (!res.ok) {
          return new Response(
            JSON.stringify({ error: `Failed to fetch page: ${res.status}` }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }

        const html = await res.text();

        // Try to extract structured data from JSON-LD script tags
        const result: Record<string, unknown> = {};

        // Method 1: JSON-LD structured data
        const jsonLdRegex = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
        let match: RegExpExecArray | null;
        let foundData = false;

        while ((match = jsonLdRegex.exec(html)) !== null) {
          try {
            const data = JSON.parse(match[1]);
            if (data) {
              // Handle @graph arrays
              const items = data["@graph"] ? data["@graph"] : [data];
              for (const item of items) {
                if (item["@type"] === "Offer" || item["@type"] === "Product" || item["@type"] === "Residence" || item["@type"] === "Apartment") {
                  if (item.name) result.title = item.name;
                  if (item.description) result.description = item.description;
                  if (item.address) {
                    if (typeof item.address === "string") {
                      result.address = item.address;
                    } else if (item.address.addressLocality || item.address.streetAddress) {
                      const parts = [
                        item.address.streetAddress,
                        item.address.addressLocality,
                      ].filter(Boolean);
                      result.address = parts.join(", ");
                    }
                  }
                  if (item.offers?.price) {
                    result.price = parseFloat(String(item.offers.price));
                  }
                  if (item.numberOfRooms) result.rooms = parseInt(String(item.numberOfRooms));
                  if (item.floorSize?.value) result.area = parseFloat(String(item.floorSize.value));
                  foundData = true;
                  break;
                }
                if (!foundData && item.name) {
                  result.title = item.title || item.name;
                  if (item.description) result.description = item.description;
                }
              }
            }
          } catch {
            // skip malformed JSON-LD
          }
        }

        // Method 2: Regex extraction from HTML title and meta tags
        if (!result.title) {
          const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
          if (titleMatch) {
            let title = titleMatch[1].trim();
            // Remove common suffixes like " - ЦИАН" or " | ЦИАН"
            title = title.replace(/\s*[-|,]\s*(ЦИАН|cian\.ru).*$/i, "").trim();
            if (title) result.title = title;
          }
        }

        // Extract price from meta tags or HTML
        if (!result.price) {
          const priceMatch =
            html.match(/"price":\s*"?(\d[\d\s]*)"?/) ||
            html.match(/price["\s:]+(\d[\d\s]*)/) ||
            html.match(/(\d[\d\s]*)\s*₽/);
          if (priceMatch) {
            const numStr = priceMatch[1].replace(/\s/g, "");
            result.price = parseInt(numStr);
          }
        }

        // Extract address from meta or HTML
        if (!result.address) {
          const addrMatch =
            html.match(/"addressLocality":\s*"([^"]+)"/) ||
            html.match(/"streetAddress":\s*"([^"]+)"/) ||
            html.match(/<meta[^>]*content="([^"]+)"[^>]*name="address"/i) ||
            html.match(/<meta[^>]*name="address"[^>]*content="([^"]+)"/i);
          if (addrMatch) {
            result.address = addrMatch[1];
          }
        }

        // Extract rooms
        if (!result.rooms) {
          const roomsMatch =
            html.match(/"numberOfRooms":\s*(\d+)/) ||
            html.match(/rooms["\s:]+(\d+)/) ||
            html.match(/(\d+)-комн/i);
          if (roomsMatch) {
            result.rooms = parseInt(roomsMatch[1]);
          }
        }

        // Extract area
        if (!result.area) {
          const areaMatch =
            html.match(/"floorSize"[^}]*"value":\s*([\d.]+)/) ||
            html.match(/"area"[^}]*"value":\s*([\d.]+)/) ||
            html.match(/(\d+(?:\.\d+)?)\s*м²/) ||
            html.match(/(\d+(?:\.\d+)?)\s*кв\.?\s*м/);
          if (areaMatch) {
            result.area = parseFloat(areaMatch[1]);
          }
        }

        // Extract description from meta
        if (!result.description) {
          const descMatch =
            html.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"/i) ||
            html.match(/<meta[^>]*content="([^"]+)"[^>]*name="description"/i);
          if (descMatch) {
            result.description = descMatch[1];
          }
        }

        if (Object.keys(result).length === 0) {
          return new Response(
            JSON.stringify({ error: "Не удалось извлечь данные из страницы" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }

        return new Response(JSON.stringify(result), {
          headers: { "Content-Type": "application/json" },
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return new Response(
          JSON.stringify({ error: `Fetch error: ${message}` }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // Health check
    if (url.pathname === "/health") {
      return new Response(
        JSON.stringify({ status: "ok", service: "cian-parser" }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response("Not found", { status: 404 });
  },
});

console.log("[cian-parser] Running on http://localhost:3080");