export type Locale = "ru" | "en";

export const translations = {
  ru: {
    nav: {
      about: "Обо мне",
      reviews: "Отзывы",
      contact: "Контакты",
      cian: "Объекты на ЦИАН",
    },
    hero: {
      greeting: "Риэлтор, Санкт-Петербург",
      name: "Илья Ратников",
      role: "Помогаю с недвижимостью в Петербурге",
      line1:
        "Покупка, продажа, новостройки — от подбора до подписания документов",
      line2: "Партнёр Setl Group — скидка 2% на все их ЖК",
      cta: "Написать мне",
      cian: "Смотреть объекты на ЦИАН",
    },
    about: {
      label: "Обо мне",
      title: "Я не агентство — я один человек, который всё делает сам",
      description:
        "Звоните или пишете — я подбираю варианты, организую показы, проверяю документы через Росреестр, веду переговоры и сопровождаю до регистрации права собственности. Если продаёте — снимаю профессиональные фото, размещаю на ЦИАН и Авито, запускаю таргет. Вам не нужно ни о чём думать, кроме принятия решения.",
      servicesTitle: "С чем помогу",
      services: [
        {
          title: "Покупка квартиры",
          text: "Подбор по вашим критериям. Показы, сравнение вариантов, проверка юридической чистоты, сопровождение до регистрации.",
        },
        {
          title: "Продажа квартиры",
          text: "Оценка, профессиональные фото, размещение на ЦИАН и Авито, таргетированная реклама, показы, переговоры с покупателями.",
        },
        {
          title: "Новостройки Setl Group",
          text: "Официальный партнёр — даю скидку 2% от стоимости. Помогаю выбрать ЖК, планировку и зафиксировать цену.",
        },
        {
          title: "Юридическое сопровождение",
          text: "Проверка объекта через Росреестр и суды. Подготовка договора, расчёты, регистрация перехода права.",
        },
      ],
      setlTitle: "Setl Group",
      setText:
        "Партнёр застройщика Setl Group (ПЕТРОБЕТОН, Силла, Пelta). Скидка 2% на все их объекты в Петербурге — на квартире за 10 млн это 200 тысяч экономии. Актуальные планировки и цены под рукой.",
      partner: "Партнёр застройщика",
    },
    stats: {
      label: "Опыт",
      items: [
        { value: "15+", label: "сделок" },
        { value: "2", label: "года практики" },
        { value: "2%", label: "скидка Setl Group" },
      ],
    },
    cases: {
      label: "Кейсы",
      title: "Работа на цифрах",
    },
    reviews: {
      label: "Отзывы",
      title: "Что говорят клиенты",
      placeholder:
        "Здесь появятся отзывы — пока их нет, но можете спросить моих клиентов напрямую.",
    },
    contact: {
      label: "Связаться",
      title: "Напишите или позвоните",
      subtitle: "Расскажите, что ищете — и я предложу варианты.",
      name: "Имя",
      phone: "Телефон",
      submit: "Отправить",
      success: "Отправлено! Свяжусь в ближайшее время.",
      error: "Ошибка. Попробуйте ещё раз.",
      required: "Обязательное поле",
      duplicateWarning:
        "Такой номер уже зарегистрирован. Я свяжусь с вами.",
      callbackButton: "Перезвоните мне",
      callbackTitle: "Обратный звонок",
      callbackDescription: "Оставьте номер — перезвоню в удобное время.",
      callbackSubmit: "Перезвоните",
      callbackSuccess: "Заявка отправлена! Скоро свяжусь.",
    },
    faq: {
      label: "Вопросы",
      title: "Часто спрашивают",
      items: [
        {
          question: "Сколько это стоит?",
          answer:
            "При покупке с первичного рынка — мне платит застройщик, для вас бесплатно. При покупке вторички — комиссию обычно берёт продавец. При продаже вашей квартиры — обсуждается индивидуально, обычно процент от сделки. Первая консультация без оплаты.",
        },
        {
          question: "Вы только по Петербургу?",
          answer:
            "Да, Санкт-Петербург и область. Если нужен другой город — помогу найти надёжного коллегу.",
        },
        {
          question: "Как быстро можно провести сделку?",
          answer:
            "Если покупатель уже есть — 3–5 дней на проверку и регистрацию. Если нужно искать — от двух недель. Продажа с рекламой занимает от двух недель до месяца.",
        },
        {
          question: "Что за скидка 2%?",
          answer:
            "Я официальный партнёр Setl Group. При покупке любого их ЖК через меня вы получаете скидку 2% от стоимости квартиры. На 10 млн — это 200 000 рублей. Скидка фиксируется в договоре.",
        },
      ],
    },
    floating: {
      telegram: "Написать в Telegram",
      max: "Написать в Max",
    },
    footer: {
      madeIn: "Санкт-Петербург, 2025",
    },
  },
  en: {
    nav: {
      about: "About Me",
      reviews: "Reviews",
      contact: "Contact",
      cian: "Properties on Cian",
    },
    hero: {
      greeting: "Realtor, St. Petersburg",
      name: "Ilya Ratnikov",
      role: "Helping with real estate in St. Petersburg",
      line1:
        "Buying, selling, new builds — from selection to signing documents",
      line2: "Setl Group partner — 2% discount on all their developments",
      cta: "Write to me",
      cian: "View properties on Cian",
    },
    about: {
      label: "About Me",
      title: "I'm not an agency — I'm one person who does everything myself",
      description:
        "Call or write — I find options, arrange viewings, check documents through Rosreestr, negotiate, and accompany you to the title registration. If you're selling — I take professional photos, list on Cian and Avito, run targeted ads. You don't have to think about anything except making the decision.",
      servicesTitle: "How I can help",
      services: [
        {
          title: "Buying an apartment",
          text: "Search by your criteria. Viewings, comparing options, legal verification, support through registration.",
        },
        {
          title: "Selling an apartment",
          text: "Valuation, professional photos, listing on Cian and Avito, targeted ads, viewings, buyer negotiations.",
        },
        {
          title: "Setl Group new builds",
          text: "Official partner — I give a 2% discount off the price. I help choose the development, floor plan, and lock in the price.",
        },
        {
          title: "Legal support",
          text: "Property check through Rosreestr and courts. Contract preparation, calculations, title transfer registration.",
        },
      ],
      setlTitle: "Setl Group",
      setText:
        "Partner of Setl Group developer (PETROBETON, Silla, Pelta). 2% discount on all their properties in St. Petersburg — on a 10M apartment that's 200K in savings. Current floor plans and prices on hand.",
      partner: "Developer partner",
    },
    stats: {
      label: "Experience",
      items: [
        { value: "15+", label: "deals" },
        { value: "2", label: "years of practice" },
        { value: "2%", label: "Setl Group discount" },
      ],
    },
    cases: {
      label: "Cases",
      title: "Results in numbers",
    },
    reviews: {
      label: "Reviews",
      title: "What clients say",
      placeholder:
        "Reviews will appear here — for now there are none, but you can ask my clients directly.",
    },
    contact: {
      label: "Get in touch",
      title: "Write or call",
      subtitle: "Tell me what you're looking for — and I'll suggest options.",
      name: "Name",
      phone: "Phone",
      submit: "Send",
      success: "Sent! I'll get back to you soon.",
      error: "Error. Please try again.",
      required: "Required field",
      duplicateWarning:
        "This number is already registered. I'll contact you.",
      callbackButton: "Call me back",
      callbackTitle: "Callback",
      callbackDescription: "Leave your number — I'll call at a convenient time.",
      callbackSubmit: "Call me",
      callbackSuccess: "Request sent! I'll be in touch soon.",
    },
    faq: {
      label: "Questions",
      title: "Frequently asked",
      items: [
        {
          question: "How much does it cost?",
          answer:
            "When buying from a developer — they pay me, it's free for you. When buying resale — the seller usually pays the commission. When selling your apartment — discussed individually, usually a percentage of the deal. First consultation is free.",
        },
        {
          question: "Do you only work in St. Petersburg?",
          answer:
            "Yes, St. Petersburg and the region. If you need another city — I'll help find a reliable colleague.",
        },
        {
          question: "How fast can a deal be done?",
          answer:
            "If the buyer is already found — 3–5 days for verification and registration. If we need to search — from two weeks. Selling with advertising takes from two weeks to a month.",
        },
        {
          question: "What's the 2% discount?",
          answer:
            "I'm an official Setl Group partner. When you buy any of their developments through me, you get a 2% discount off the apartment price. On 10M, that's 200,000 rubles. The discount is fixed in the contract.",
        },
      ],
    },
    floating: {
      telegram: "Write on Telegram",
      max: "Write on Max",
    },
    footer: {
      madeIn: "St. Petersburg, 2025",
    },
  },
} as const;

export type TranslationKey = keyof (typeof translations)["ru"];

export function t(locale: Locale, section: TranslationKey) {
  return translations[locale][section] as (typeof translations)["ru"][typeof section];
}