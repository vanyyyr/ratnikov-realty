export type Locale = "ru" | "en";

export const translations = {
  ru: {
    nav: {
      about: "О специалисте",
      services: "Услуги",
      reviews: "Отзывы",
      contact: "Контакты",
      cian: "Объекты на ЦИАН",
      admin: "CRM",
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
      admin: "CRM",
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