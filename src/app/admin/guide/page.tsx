"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Handshake,
  UserCircle,
  Building2,
  CheckSquare,
  BarChart3,
  Settings,
  MessageSquare,
  Star,
  Trophy,
  Phone,
  Zap,
  Link2,
  Image as ImageIcon,
  Clock,
  Percent,
  Download,
  Send,
  Globe,
  Tag,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

interface GuideSection {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  color: string;
  features: {
    title: string;
    description: string;
    tip?: string;
  }[];
}

const SECTIONS: GuideSection[] = [
  {
    id: "leads",
    icon: Users,
    title: "Лиды",
    color: "bg-blue-100 text-blue-700",
    features: [
      {
        title: "Быстрое добавление",
        description: "Красная панель вверху страницы. На мобильном виден только номер телефона — имя необязательно. Если не указать имя, подставится номер. Нажмите Enter для отправки.",
        tip: "Идеально для добавления лида прямо во время звонка — ввёл номер и нажал Enter.",
      },
      {
        title: "Фильтрация по статусу",
        description: "Вкладки: Все / Новые / Контактированные / Квалифицированные / Потерянные. Также фильтр по тегам и текстовый поиск.",
      },
      {
        title: "Редактирование inline",
        description: "Нажмите на строку лида, чтобы раскрыть детали. Там можно изменить статус, сервис, заметки, теги. Всё сохраняется автоматически.",
      },
      {
        title: "Теги",
        description: "Нажмите на тег в раскрытом лиде, чтобы добавить/убрать. Есть предустановленные: VIP, Покупатель, Продавец, Инвестор, Арендатор, Новостройка, Вторичный рынок. Можно вводить свои.",
      },
      {
        title: "Шаблоны сообщений",
        description: "Кнопка с иконкой сообщения рядом с лидом. Выбираете шаблон → текст копируется в буфер → вставляете в мессенджер. Шаблоны настраиваются в разделе «Шаблоны».",
      },
      {
        title: "Задачи лида",
        description: "В раскрытом лиде видны привязанные задачи. Можно быстро создать задачу прямо оттуда.",
      },
      {
        title: "Импорт/Экспорт CSV",
        description: "Кнопки скачивания и загрузки CSV в панели фильтров. Формат: имя, телефон, сервис, комментарий. При импорте дубликаты по номеру телефона пропускаются.",
      },
      {
        title: "Уведомления",
        description: "Каждый новый лид с сайта автоматически отправляется в Telegram (если настроен бот) и на вебхук Max.",
      },
    ],
  },
  {
    id: "deals",
    icon: Handshake,
    title: "Сделки",
    color: "bg-green-100 text-green-700",
    features: [
      {
        title: "Канбан-доска",
        description: "6 колонок: Новая → Показ → Переговоры → Договор → Успешно / Провалено. Перетаскивайте сделки между стадиями через выпадающий список в карточке.",
      },
      {
        title: "Автоматический расчёт комиссии",
        description: "Когда сделку переводят в стадию «Успешно», система автоматически рассчитывает комиссию по формуле: Сумма × (Ставка % / 100). Ставка берётся из настроек (по умолчанию 3%).",
        tip: "Комиссия отображается зелёным текстом в карточке сделки. Можно вручную изменить в редакторе.",
      },
      {
        title: "Создание сделки",
        description: "Нажмите «Новая сделка». Обязательные поля: название и клиент. Остальное заполняете по необходимости — объект, сумма, стадия, заметки.",
      },
      {
        title: "Привязка к объекту",
        description: "Сделку можно привязать к объекту недвижимости из CRM. Это помогает отслеживать, какой объект в какой сделке.",
      },
      {
        title: "Логирование",
        description: "Каждая смена стадии автоматически записывается в лог активности (видно на дашборде).",
      },
    ],
  },
  {
    id: "clients",
    icon: UserCircle,
    title: "Клиенты",
    color: "bg-purple-100 text-purple-700",
    features: [
      {
        title: "Связь с лидами и сделками",
        description: "Клиент может быть создан вручную или автоматически из лида. У клиента есть ссылка на исходный лид и все его сделки.",
      },
      {
        title: "Контактная информация",
        description: "Имя, телефон, email, Telegram (handle), Max ID. Всё необязательное кроме имени и телефона.",
      },
      {
        title: "Заметки и теги",
        description: "Произвольные заметки и теги для сегментации клиентской базы.",
      },
    ],
  },
  {
    id: "properties",
    icon: Building2,
    title: "Объекты недвижимости",
    color: "bg-amber-100 text-amber-700",
    features: [
      {
        title: "Импорт с ЦИАН",
        description: "Кнопка «Импорт с ЦИАН» → вставляете ссылку на объявление → система парсит данные (название, адрес, комнаты, площадь, цена, описание). Данные загружаются в форму — вы проверяете и сохраняете.",
        tip: "Парсер работает с отдельными объявлениями ЦИАН. Вставляйте URL вида https://cian.ru/sale/flat/...",
      },
      {
        title: "Фотогалерея",
        description: "В форме объекта есть блок «Фотографии». Добавляйте URL фото (с ЦИАН, Авито или других источников). Фото отображаются сеткой с превью. В карточке объекта показывается первое фото и счётчик.",
      },
      {
        title: "Таймер на рынке",
        description: "На каждой карточке объекта показан бейдж «X дн.» — сколько дней объект в базе. Цвет зависит от срока: серый (до 30), жёлтый (31–60), красный (более 60). Помогает быстро видеть, какие объекты «зависли».",
      },
      {
        title: "Статусы",
        description: "Доступно / Бронь / Продано. Фильтрация по статусу через вкладки.",
      },
      {
        title: "Ссылка на ЦИАН",
        description: "Если у объекта есть ссылка на ЦИАН, на карточке появляется кнопка-ссылка для быстрого перехода к объявлению.",
      },
    ],
  },
  {
    id: "tasks",
    icon: CheckSquare,
    title: "Задачи",
    color: "bg-red-100 text-red-700",
    features: [
      {
        title: "Привязка к лидам и сделкам",
        description: "При создании задачи можно выбрать лид или сделку, к которым она относится. В списке задач отображаются бейджи-ссылки на привязанный лид/сделку.",
        tip: "Это связывает задачи с контекстом — видя задачу, сразу понимаете, к какому клиенту она относится.",
      },
      {
        title: "Приоритеты",
        description: "Высокий (красный), Средний (жёлтый), Низкий (зелёный). Цветная точка слева от каждой задачи.",
      },
      {
        title: "Сроки и просрочка",
        description: "Укажите дедлайн. Просроченные задачи подсвечиваются красным с бейджем «Просрочено».",
      },
      {
        title: "Быстрое выполнение",
        description: "Чекбокс слева — кликните, чтобы отметить задачу выполненной. Повторный клик возвращает в работу.",
      },
      {
        title: "Фильтрация",
        description: "Вкладки: Все / В ожидании / В работе / Выполнено.",
      },
    ],
  },
  {
    id: "analytics",
    icon: BarChart3,
    title: "Аналитика",
    color: "bg-indigo-100 text-indigo-700",
    features: [
      {
        title: "Общая статистика",
        description: "Количество лидов, клиентов, сделок, объектов, задач — всё на одном экране.",
      },
      {
        title: "Конверсия",
        description: "Воронка: лиды → клиенты → сделки. Видно, на каком этапе теряется больше всего.",
      },
      {
        title: "Лог активности",
        description: "Последние действия в CRM: создание сделок, смена стадий, новые лиды. Помогает понять, что происходило.",
      },
    ],
  },
  {
    id: "templates",
    icon: MessageSquare,
    title: "Шаблоны сообщений",
    color: "bg-teal-100 text-teal-700",
    features: [
      {
        title: "Шаблоны для быстрых ответов",
        description: "Создайте шаблоны для типичных сообщений: приветствие, после показа, follow-up, поздравление. Используйте плейсхолдер {name} — он заменится на имя клиента.",
      },
      {
        title: "Использование",
        description: "В карточке лида нажмите кнопку с иконкой сообщения → выберите шаблон → текст скопируется. Вставьте в Telegram или другой мессенджер.",
      },
    ],
  },
  {
    id: "reviews",
    icon: Star,
    title: "Отзывы",
    color: "bg-yellow-100 text-yellow-700",
    features: [
      {
        title: "Управление отзывами",
        description: "Добавляйте отзывы от клиентов: имя, текст, рейтинг (1–5), источник (ЦИАН, Google, Яндекс, вручную).",
      },
      {
        title: "Публикация на сайте",
        description: "Отзывы отображаются на сайте в разделе «Отзывы». Можно скрыть отзыв (галочка «Скрыть») — он не появится на сайте, но останется в CRM.",
      },
      {
        title: "Сортировка",
        description: "Поле «Порядок» — чем меньше число, тем выше отзыв на сайте. По умолчанию 0.",
      },
    ],
  },
  {
    id: "cases",
    icon: Trophy,
    title: "Кейсы",
    color: "bg-orange-100 text-orange-700",
    features: [
      {
        title: "Кейсы на сайте",
        description: "Раздел «Кейсы» на сайте показывает реальные результаты работы. Каждый кейс: текст и результат (например, «Продано за 12 дней»).",
      },
      {
        title: "Переключатель видимости",
        description: "В настройках CRM есть переключатель «Раздел кейсы». Если выключить — раздел пропадёт с сайта, но кейсы сохранятся в CRM.",
      },
    ],
  },
  {
    id: "settings",
    icon: Settings,
    title: "Настройки",
    color: "bg-gray-200 text-gray-700",
    features: [
      {
        title: "Telegram бот",
        description: "Bot Token и Chat ID для получения уведомлений о новых заявках. Кнопка «Тест» для проверки.",
      },
      {
        title: "Max вебхук",
        description: "URL вебхука для отправки данных о лидах в Max.",
      },
      {
        title: "Социальные сети",
        description: "Ссылки на Telegram, ВКонтакте, Instagram, WhatsApp — отображаются на сайте (кнопки внизу экрана и в контактах).",
      },
      {
        title: "Яндекс.Метрика",
        description: "ID счётчика — подключается автоматически на сайте при указании.",
      },
      {
        title: "Профиль ЦИАН",
        description: "Ссылка на профиль/поиск ЦИАН — используется для кнопки «Смотреть объекты» на сайте.",
      },
      {
        title: "Контакты",
        description: "Телефон и адрес офиса — отображаются на сайте в разделе контактов и на карте.",
      },
      {
        title: "Переключатели разделов",
        description: "Три переключателя: Отзывы, Кейсы, Статистика. Включаете/выключаете — раздел мгновенно появляется/исчезает на сайте. Не нужно перезагружать или redeploy.",
      },
      {
        title: "Комиссия",
        description: "Процент комиссии по умолчанию (3%). Используется для авторасчёта при закрытии сделки.",
      },
      {
        title: "Смена пароля",
        description: "Введите текущий пароль, затем новый (минимум 4 символа) и подтверждение.",
      },
    ],
  },
];

export default function GuidePage() {
  const [expanded, setExpanded] = useState<string | null>("leads");

  const toggle = (id: string) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  return (
    <div className="max-w-3xl space-y-3">
      <p className="text-sm text-gray-500 mb-4">
        Полный гайд по всем разделам CRM. Нажмите на раздел, чтобы раскрыть детали.
      </p>

      {SECTIONS.map((section) => {
        const Icon = section.icon;
        const isOpen = expanded === section.id;

        return (
          <Card key={section.id} className="overflow-hidden">
            <button
              onClick={() => toggle(section.id)}
              className="w-full text-left p-4 sm:p-5 flex items-center gap-3 hover:bg-gray-50/50 transition-colors"
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${section.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-gray-900">{section.title}</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {section.features.length} {section.features.length === 1 ? "функция" : section.features.length < 5 ? "функции" : "функций"}
                </p>
              </div>
              {isOpen ? (
                <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              )}
            </button>

            {isOpen && (
              <div className="border-t border-gray-100 px-4 sm:px-5 pb-4 sm:pb-5 pt-4 space-y-4">
                {section.features.map((feature, idx) => (
                  <div key={idx}>
                    <h4 className="font-medium text-sm text-gray-900 mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                    {feature.tip && (
                      <div className="mt-2 bg-amber-50 border border-amber-200/60 rounded-lg px-3 py-2">
                        <p className="text-xs text-amber-800">
                          <span className="font-semibold">Совет:</span> {feature.tip}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        );
      })}

      <div className="pt-4 pb-2">
        <p className="text-xs text-gray-400 text-center">
          CRM работает на SQLite — все данные хранятся локально. Резервное копирование папки проекта сохранит и базу данных.
        </p>
      </div>
    </div>
  );
}