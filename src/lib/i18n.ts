export type Locale = "ru" | "en";

export const translations = {
  ru: {
    nav: {
      about: "О специалисте",
      services: "Услуги",
      reviews: "Отзывы",
      contact: "Контакты",
      cian: "Объекты на ЦИАН",
    },
    hero: {
      greeting: "Недвижимость Санкт-Петербурга и ЛО",
      name: "Илья Ратников",
      title: "Риэлтор-эксперт",
      subtitle:
        "Универсальный специалист по недвижимости. Комплексный подход к решению ваших задач — от подбора объекта до полного сопровождения сделки.",
      cta: "Оставить заявку",
      cian: "Смотреть объекты",
      scroll: "Узнать больше",
    },
    about: {
      label: "О специалисте",
      title: "Комплексный подход к недвижимости",
      description:
        "Предлагаю комплексное сопровождение сделок с недвижимостью, включая маркетинговые и юридические услуги. Проконсультирую по новостройкам, предоставлю экспертное заключение и организую показы объектов. Активно продвигаю объекты на рынке и обеспечиваю эффективное взаимодействие с клиентами.",
      mission: "Миссия и принципы работы",
      missionText:
        "Комплексный подход к реализации недвижимости, включая маркетинговое и юридическое сопровождение. Сотрудничество с холдингом Setl Group и консультации по новостройкам с скидкой 2%. Наша цель — обеспечить эффективное продвижение объектов и успешное завершение сделок.",
      partner: "Партнёр — Setl Group",
    },
    advantages: {
      label: "Почему я",
      title: "Ваше преимущество в работе со мной",
      items: [
        {
          title: "Экспертиза и аналитика рынка",
          text: "Актуальные данные о рыночной конъюнктуре позволяют установить объективную стоимость объекта. Это предотвращает финансовые потери из-за занижения цены при продаже или переплаты при покупке.",
        },
        {
          title: "Юридическая чистота и минимизация рисков",
          text: "Проверка правоустанавливающих документов, истории объекта и дееспособности сторон — критически важно для предотвращения оспаривания сделки в будущем.",
        },
        {
          title: "Профессиональный маркетинг",
          text: "Максимальный охват целевой аудитории через специализированные каналы: закрытые базы, таргетированная реклама. Расширение воронки поиска, включая объекты, которых ещё нет в открытом доступе.",
        },
        {
          title: "Эффективные переговоры",
          text: "Выступая в качестве медиатора, исключаю эмоциональный фактор. Навык профессионального ведения торгов позволяет защитить ваши интересы и добиться оптимальных условий.",
        },
      ],
    },
    services: {
      label: "Услуги",
      title: "Мои услуги",
      subtitle:
        "Маркетинговое и юридическое сопровождение, консультации по новостройкам, расчёт стоимости, организация показов, обзвон покупателей, проверка контрагентов и оформление договоров.",
      items: [
        {
          title: "Маркетинговое и юридическое сопровождение",
          text: "Полный комплекс услуг по сопровождению сделки с учётом всех юридических аспектов.",
        },
        {
          title: "Консультации по новостройкам",
          text: "Информация о новостройках с учётом скидки 2% на объекты Setl Group.",
        },
        {
          title: "Подготовка экспертного заключения",
          text: "Расчёт актуальной рыночной стоимости объекта недвижимости.",
        },
        {
          title: "Экспресс-сопровождение сделки",
          text: "Для клиентов, у которых уже есть покупатель. Полное сопровождение, включая проверку документов и закрепление договорённостей.",
        },
      ],
    },
    stats: {
      label: "Цифры",
      items: [
        { value: "2+", label: "Года в профессии" },
        { value: "15+", label: "Успешных сделок" },
        { value: "98%", label: "Довольных клиентов" },
        { value: "24/7", label: "На связи" },
      ],
    },
    reviews: {
      label: "Отзывы",
      title: "Что говорят клиенты",
      placeholder:
        "Отзывы от клиентов появятся здесь после завершения первых сделок. Ваше доверие — моя главная рекомендация.",
    },
    contact: {
      label: "Связаться",
      title: "Оставьте заявку",
      subtitle:
        "Заполните форму и я свяжусь с вами в ближайшее время для обсуждения вашего вопроса.",
      name: "Ваше имя",
      phone: "Телефон",
      serviceType: "Тип услуги",
      serviceTypes: [
        "Покупка недвижимости",
        "Продажа недвижимости",
        "Консультация по новостройкам",
        "Экспертное заключение",
        "Экспресс-сопровождение сделки",
        "Другое",
      ],
      comment: "Комментарий",
      commentPlaceholder: "Расскажите подробнее о вашем запросе...",
      submit: "Отправить заявку",
      success: "Заявка отправлена! Я свяжусь с вами в ближайшее время.",
      error: "Произошла ошибка. Попробуйте ещё раз.",
      required: "Обязательное поле",
      duplicateWarning: "Такой номер уже зарегистрирован. Мы свяжемся с вами повторно.",
      callbackButton: "Перезвоните мне",
      callbackTitle: "Обратный звонок",
      callbackDescription: "Оставьте контактные данные и я перезвоню вам в удобное время.",
      callbackSubmit: "Перезвоните",
      callbackSuccess: "Заявка на звонок отправлена! Я скоро свяжусь с вами.",
    },
    faq: {
      label: "FAQ",
      title: "Частые вопросы",
      items: [
        {
          question: "Как выбрать район для покупки?",
          answer: "Определите приоритеты: близость к метро, школам, паркам и инфраструктуре. Я помогу проанализировать районы с учётом вашего бюджета и образа жизни, предложив несколько вариантов для сравнения."
        },
        {
          question: "Какие документы нужны для сделки?",
          answer: "Для покупки потребуется паспорт, для продажи — выписка из ЕГРН, правоустанавливающие документы и справки об отсутствии обременений. Я подготовлю полный пакет документов и проверю их юридическую чистоту."
        },
        {
          question: "Как проверить юридическую чистоту?",
          answer: "Проверяю через Росреестр, суды и ФССП: обременения, аресты, долги по ЖКХ, правоустанавливающие документы и историю перехода прав. Это исключает риски оспаривания сделки после подписания договора."
        },
        {
          question: "Сколько времени занимает сделка?",
          answer: "Стандартная сделка купли-продажи занимает 2–4 недели от подписания договора до регистрации права собственности. Экспресс-сопровождение при готовом покупателе сокращает срок до 3–5 дней."
        },
        {
          question: "Что такое экспресс-сопровождение?",
          answer: "Это услуга для клиентов, у которых уже есть покупатель или продавец. Я беру на себя проверку документов, подготовку договора, сопровождение сделки и регистрацию перехода права."
        },
        {
          question: "Есть ли скидки на новостройки?",
          answer: "Да, как партнёр Setl Group я предоставляю скидку 2% на объекты холдинга. Также отслеживаю акции и специальные предложения других застройщиков, что позволяет дополнительно сэкономить."
        },
      ],
    },
    exitIntent: {
      title: "Подождите!",
      description: "Оставьте заявку и получите бесплатную консультацию по недвижимости",
      name: "Ваше имя",
      phone: "Телефон",
      submit: "Получить консультацию",
      success: "Спасибо! Я свяжусь с вами в ближайшее время.",
    },
    floating: {
      telegram: "Написать в Telegram",
      max: "Написать в Max",
    },
    footer: {
      rights: "Все права защищены.",
      madeIn: "Санкт-Петербург",
      contacts: "Контакты",
      address: "Офис: ул. Комсомола, 41",
      quickLinks: "Навигация",
      followMe: "Соцсети",
      telegram: "Telegram",
      vk: "ВКонтакте",
    },
  },
  en: {
    nav: {
      about: "About",
      services: "Services",
      reviews: "Reviews",
      contact: "Contact",
      cian: "Properties on Cian",
    },
    hero: {
      greeting: "Real Estate in St. Petersburg & LLO",
      name: "Ilya Ratnikov",
      title: "Expert Realtor",
      subtitle:
        "Universal real estate specialist. A comprehensive approach to solving your tasks — from property selection to full deal support.",
      cta: "Submit Request",
      cian: "View Properties",
      scroll: "Learn More",
    },
    about: {
      label: "About",
      title: "Comprehensive Real Estate Approach",
      description:
        "I offer comprehensive real estate transaction support, including marketing and legal services. I will advise on new builds, provide an expert opinion, and organize property viewings. I actively promote properties on the market and ensure effective client interaction.",
      mission: "Mission & Work Principles",
      missionText:
        "A comprehensive approach to real estate realization, including marketing and legal support. Partnership with Setl Group holding and consultations on new builds with a 2% discount. Our goal is to ensure effective property promotion and successful deal completion.",
      partner: "Partner — Setl Group",
    },
    advantages: {
      label: "Why Me",
      title: "Your Advantage in Working With Me",
      items: [
        {
          title: "Market Expertise & Analytics",
          text: "Current market data allows establishing an objective property value, preventing financial losses from underpricing during sales or overpaying during purchases.",
        },
        {
          title: "Legal Purity & Risk Minimization",
          text: "Verification of title documents, property history, and legal capacity of parties — critical for preventing future deal disputes.",
        },
        {
          title: "Professional Marketing",
          text: "Maximum target audience reach through specialized channels: closed databases, targeted advertising. Expanding the search funnel including off-market properties.",
        },
        {
          title: "Effective Negotiations",
          text: "Acting as a mediator, I eliminate the emotional factor. Professional negotiation skills protect your interests and achieve optimal terms.",
        },
      ],
    },
    services: {
      label: "Services",
      title: "My Services",
      subtitle:
        "Marketing and legal support, new build consultations, property valuation, viewings, buyer outreach, counterparty verification, and contract preparation.",
      items: [
        {
          title: "Marketing & Legal Support",
          text: "Full range of deal support services with all legal aspects covered.",
        },
        {
          title: "New Build Consultations",
          text: "Information on new builds with a 2% discount on Setl Group properties.",
        },
        {
          title: "Expert Property Valuation",
          text: "Calculation of the current market value of a real estate property.",
        },
        {
          title: "Express Deal Support",
          text: "For clients who already have a buyer. Full support including document verification and agreement formalization.",
        },
      ],
    },
    stats: {
      label: "Numbers",
      items: [
        { value: "2+", label: "Years of Experience" },
        { value: "15+", label: "Successful Deals" },
        { value: "98%", label: "Satisfied Clients" },
        { value: "24/7", label: "Available" },
      ],
    },
    reviews: {
      label: "Reviews",
      title: "What Clients Say",
      placeholder:
        "Client reviews will appear here after the first deals are completed. Your trust is my best recommendation.",
    },
    contact: {
      label: "Contact",
      title: "Submit a Request",
      subtitle:
        "Fill out the form and I will contact you shortly to discuss your inquiry.",
      name: "Your Name",
      phone: "Phone",
      serviceType: "Service Type",
      serviceTypes: [
        "Buying Property",
        "Selling Property",
        "New Build Consultation",
        "Expert Valuation",
        "Express Deal Support",
        "Other",
      ],
      comment: "Comment",
      commentPlaceholder: "Tell us more about your request...",
      submit: "Submit Request",
      success:
        "Request sent! I will contact you shortly.",
      error: "An error occurred. Please try again.",
      required: "Required field",
      duplicateWarning: "This number is already registered. We will contact you again.",
      callbackButton: "Call Me Back",
      callbackTitle: "Callback Request",
      callbackDescription: "Leave your contact details and I will call you back at a convenient time.",
      callbackSubmit: "Call Me",
      callbackSuccess: "Callback request sent! I will contact you soon.",
    },
    faq: {
      label: "FAQ",
      title: "Frequently Asked Questions",
      items: [
        {
          question: "How to choose a neighborhood?",
          answer: "Define your priorities: proximity to metro, schools, parks, and infrastructure. I will help analyze neighborhoods based on your budget and lifestyle, offering several options for comparison."
        },
        {
          question: "What documents are needed?",
          answer: "For buying you need a passport, for selling — an extract from EGRN, title documents, and certificates of no encumbrances. I will prepare the full document package and verify their legal purity."
        },
        {
          question: "How to verify legal purity?",
          answer: "I check through Rosreestr, courts, and FSSP: encumbrances, arrests, utility debts, title documents, and ownership history. This eliminates risks of the deal being contested after signing."
        },
        {
          question: "How long does a deal take?",
          answer: "A standard purchase-sale deal takes 2–4 weeks from signing the contract to registering ownership rights. Express support with a ready buyer reduces this to 3–5 days."
        },
        {
          question: "What is express deal support?",
          answer: "This is a service for clients who already have a buyer or seller. I handle document verification, contract preparation, deal support, and ownership transfer registration."
        },
        {
          question: "Are there discounts on new builds?",
          answer: "Yes, as a Setl Group partner I offer a 2% discount on the holding's properties. I also track promotions and special offers from other developers, allowing additional savings."
        },
      ],
    },
    exitIntent: {
      title: "Wait!",
      description: "Leave a request and get a free real estate consultation",
      name: "Your Name",
      phone: "Phone",
      submit: "Get Consultation",
      success: "Thank you! I will contact you shortly.",
    },
    floating: {
      telegram: "Write on Telegram",
      max: "Write on Max",
    },
    footer: {
      rights: "All rights reserved.",
      madeIn: "Saint Petersburg",
      contacts: "Contacts",
      address: "Office: 41 Komsomola St.",
      quickLinks: "Navigation",
      followMe: "Social Media",
      telegram: "Telegram",
      vk: "VKontakte",
    },
  },
} as const;

export type TranslationKey = keyof (typeof translations)["ru"];

export function t(locale: Locale, section: TranslationKey) {
  return translations[locale][section] as (typeof translations)["ru"][typeof section];
}