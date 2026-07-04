export type Locale = "ru" | "en";

export const translations = {
  ru: {
    nav: {
      about: "Как я работаю",
      services: "Услуги",
      reviews: "Отзывы",
      contact: "Контакты",
      cian: "Объекты на ЦИАН",
    },
    hero: {
      greeting: "Недвижимость в Петербурге",
      name: "Илья Ратников",
      title: "Риэлтор",
      subtitle:
        "Помогаю купить, продать или оценить недвижимость в Санкт-Петербурге. Сопровождаю сделку от первого звонка до регистрации права — документы, расчёты, показы.",
      cta: "Обсудить задачу",
      cian: "Смотреть объекты",
      scroll: "Дальше",
    },
    about: {
      label: "Как я работаю",
      title: "От звонка до регистрации — полностью",
      description:
        "Берёте на себя только решение, я — всё остальное. Подбираю объекты, проверяю юридическую чистоту, веду переговоры, готовлю документы. Если нужно — продаю вашу недвижимость с максимальной выгодой через таргет и закрытые базы.",
      mission: "Setl Group",
      missionText:
        "Партнёр застройщика Setl Group — даю скидку 2% на все их объекты в Петербурге. Актуальные акции, планировки и цены под рукой.",
      partner: "Партнёр застройщика",
    },
    services: {
      label: "Услуги",
      title: "Что я делаю",
      items: [
        {
          title: "Покупка недвижимости",
          text: "Подбор объектов по вашим критериям — от студий до загородных домов. Показы, сравнение, проверка документов.",
        },
        {
          title: "Продажа недвижимости",
          text: "Оценка, профессиональные фото, размещение на ЦИАН и Авито, таргетированная реклама, показы, переговоры.",
        },
        {
          title: "Юридическое сопровождение",
          text: "Проверка чистоты объекта через Росреестр и суды. Подготовка договора, регистрация перехода права.",
        },
        {
          title: "Новостройки со скидкой",
          text: "Партнёр Setl Group — скидка 2% на все объекты холдинга. Помогаю выбрать новостройку и зафиксировать лучшую цену.",
        },
      ],
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
      title: "Результаты работы",
    },
    reviews: {
      label: "Отзывы",
      title: "Отзывы клиентов",
      placeholder:
        "Здесь появятся отзывы от клиентов. Ваше доверие — лучшая рекомендация.",
    },
    contact: {
      label: "Связаться",
      title: "Напишите мне",
      subtitle: "Расскажите, что нужно — и я предложу решение.",
      name: "Имя",
      phone: "Телефон",
      submit: "Отправить",
      success: "Отправлено! Свяжусь с вами в ближайшее время.",
      error: "Произошла ошибка. Попробуйте ещё раз.",
      required: "Обязательное поле",
      duplicateWarning: "Такой номер уже зарегистрирован. Мы свяжемся с вами повторно.",
      callbackButton: "Перезвоните мне",
      callbackTitle: "Обратный звонок",
      callbackDescription: "Оставьте номер — перезвоню в удобное время.",
      callbackSubmit: "Перезвоните",
      callbackSuccess: "Заявка на звонок отправлена! Я скоро свяжусь с вами.",
    },
    faq: {
      label: "FAQ",
      title: "Вопросы",
      items: [
        {
          question: "Сколько стоит ваша помощь?",
          answer: "Зависит от задачи. При покупке — комиссия от застройщика или продавца (часто для вас бесплатно). При продаже — обсуждается индивидуально. Первая консультация — без оплаты.",
        },
        {
          question: "Вы работаете только с Петербургом?",
          answer: "В основном Санкт-Петербург и Ленинградская область. Но если вопрос сложный — помогу найти коллегу в другом регионе.",
        },
        {
          question: "Как быстро можно закрыть сделку?",
          answer: "Экспресс-сопровождение — 3–5 дней, если покупатель уже найден. Стандартная покупка — 2–3 недели. Продажа с рекламой — от 2 недель до месяца.",
        },
        {
          question: "Что такое скидка 2% от Setl Group?",
          answer: "Я — официальный партнёр холдинга Setl Group (ПЕТРОБЕТОН, Силла, Пelta и др.). При покупке через меня вы получаете скидку 2% от стоимости квартиры. На квартире за 10 млн это экономия 200 тысяч.",
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
      about: "How I Work",
      services: "Services",
      reviews: "Reviews",
      contact: "Contact",
      cian: "Properties on Cian",
    },
    hero: {
      greeting: "Real Estate in St. Petersburg",
      name: "Ilya Ratnikov",
      title: "Realtor",
      subtitle:
        "I help you buy, sell, or value property in St. Petersburg. I handle the entire deal — from the first call to title registration: documents, calculations, viewings.",
      cta: "Discuss Your Task",
      cian: "View Properties",
      scroll: "Scroll",
    },
    about: {
      label: "How I Work",
      title: "From Call to Registration — All of It",
      description:
        "You only make the decisions, I handle everything else. I find properties, verify legal status, negotiate, and prepare documents. If needed — I sell your property at the best price using targeted ads and closed databases.",
      mission: "Setl Group",
      missionText:
        "Official partner of Setl Group — I offer a 2% discount on all their properties in St. Petersburg. Current promotions, floor plans, and prices at hand.",
      partner: "Developer Partner",
    },
    services: {
      label: "Services",
      title: "What I Do",
      items: [
        {
          title: "Buying Property",
          text: "Finding properties that match your criteria — from studios to country houses. Viewings, comparisons, document checks.",
        },
        {
          title: "Selling Property",
          text: "Valuation, professional photos, listing on Cian and Avito, targeted ads, viewings, negotiations.",
        },
        {
          title: "Legal Support",
          text: "Property verification through Rosreestr and courts. Contract preparation, title transfer registration.",
        },
        {
          title: "New Builds with Discount",
          text: "Setl Group partner — 2% discount on all holding properties. I help you choose and lock in the best price.",
        },
      ],
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
      title: "Work Results",
    },
    reviews: {
      label: "Reviews",
      title: "Client Reviews",
      placeholder:
        "Client reviews will appear here. Your trust is the best recommendation.",
    },
    contact: {
      label: "Contact",
      title: "Write to Me",
      subtitle: "Tell me what you need — I'll suggest a solution.",
      name: "Name",
      phone: "Phone",
      submit: "Send",
      success: "Sent! I'll get back to you soon.",
      error: "Something went wrong. Please try again.",
      required: "Required field",
      duplicateWarning: "This number is already registered. We'll contact you again.",
      callbackButton: "Call Me Back",
      callbackTitle: "Callback",
      callbackDescription: "Leave your number — I'll call you at a convenient time.",
      callbackSubmit: "Call Me",
      callbackSuccess: "Callback request sent! I'll contact you soon.",
    },
    faq: {
      label: "FAQ",
      title: "Questions",
      items: [
        {
          question: "How much do you charge?",
          answer: "Depends on the task. For buying — commission from the developer or seller (often free for you). For selling — discussed individually. First consultation is free.",
        },
        {
          question: "Do you only work with St. Petersburg?",
          answer: "Mostly St. Petersburg and Leningrad Oblast. But for complex cases I can find a colleague in another region.",
        },
        {
          question: "How fast can a deal close?",
          answer: "Express support — 3–5 days if the buyer is already found. Standard purchase — 2–3 weeks. Selling with advertising — 2 weeks to a month.",
        },
        {
          question: "What's the 2% Setl Group discount?",
          answer: "I'm an official partner of Setl Group (PETROBETON, Silla, Pelta, etc.). When you buy through me, you get a 2% discount on the apartment price. On a 10M apartment, that's 200K in savings.",
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