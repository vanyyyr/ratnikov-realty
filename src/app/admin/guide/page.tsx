"use client";

import {
  LayoutDashboard,
  Users,
  UserCircle,
  Handshake,
  Building2,
  CheckSquare,
  BarChart3,
  MessageSquare,
  Star,
  Settings,
  BookOpen,
  ArrowRight,
  Check,
  AlertTriangle,
  Lightbulb,
  Info,
} from "lucide-react";

/* ─── table-of-contents data ─── */
const TOC = [
  { id: "dashboard", label: "Дашборд", icon: LayoutDashboard },
  { id: "leads", label: "Лиды", icon: Users },
  { id: "clients", label: "Клиенты", icon: UserCircle },
  { id: "deals", label: "Сделки", icon: Handshake },
  { id: "properties", label: "Объекты", icon: Building2 },
  { id: "tasks", label: "Задачи", icon: CheckSquare },
  { id: "analytics", label: "Аналитика", icon: BarChart3 },
  { id: "templates", label: "Шаблоны", icon: MessageSquare },
  { id: "reviews", label: "Отзывы", icon: Star },
  { id: "cases", label: "Кейсы", icon: BookOpen },
  { id: "settings", label: "Настройки", icon: Settings },
];

/* ─── small helper icons ─── */
function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2.5 bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
      <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
      <span className="text-sm text-amber-800">{children}</span>
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2.5 bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
      <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
      <span className="text-sm text-blue-800">{children}</span>
    </div>
  );
}

function Warn({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2.5 bg-red-50 border border-red-200 rounded-lg p-3 mt-3">
      <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
      <span className="text-sm text-red-800">{children}</span>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-gray-600 text-sm leading-relaxed">
      <Check className="w-3.5 h-3.5 text-red-700 flex-shrink-0 mt-1" />
      <span>{children}</span>
    </li>
  );
}

function ArrowItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-gray-600 text-sm leading-relaxed">
      <ArrowRight className="w-3.5 h-3.5 text-red-700 flex-shrink-0 mt-1" />
      <span>{children}</span>
    </li>
  );
}

/* ─── section wrapper ─── */
function Section({
  id,
  icon: Icon,
  title,
  children,
}: {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-lg bg-red-700 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 text-gray-600 leading-relaxed">
        {children}
      </div>
    </section>
  );
}

/* ─── sub-heading inside a section ─── */
function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-base font-semibold text-gray-900 mt-5 first:mt-0">
      {children}
    </h3>
  );
}

/* ─── badge-like status chip ─── */
function StatusChip({
  label,
  color = "bg-gray-100 text-gray-700",
}: {
  label: string;
  color?: string;
}) {
  return (
    <span
      className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${color}`}
    >
      {label}
    </span>
  );
}

/* ====================================================================
   GUIDE PAGE
   ==================================================================== */
export default function GuidePage() {
  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-6xl">
      {/* ── table of contents (desktop: sticky sidebar) ── */}
      <aside className="hidden lg:block w-56 flex-shrink-0">
        <div className="sticky top-24">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Содержание
          </p>
          <nav className="space-y-1">
            {TOC.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-sm text-gray-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* ── mobile TOC ── */}
      <nav className="lg:hidden flex flex-wrap gap-2">
        {TOC.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-medium text-gray-600 hover:text-red-700 hover:border-red-200 transition-colors"
            >
              <Icon className="w-3.5 h-3.5" />
              {item.label}
            </a>
          );
        })}
      </nav>

      {/* ── main content ── */}
      <div className="flex-1 max-w-4xl space-y-10">
        {/* page header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Гайд по CRM
          </h1>
          <p className="text-gray-500 mt-1">
            Полное описание всех разделов и возможностей системы управления
            недвижимостью
          </p>
        </div>

        {/* ──────── 1. DASHBOARD ──────── */}
        <Section id="dashboard" icon={LayoutDashboard} title="Дашборд">
          <p>
            Дашборд — это главная страница CRM, которая открывается при входе в
            систему. Здесь собрана ключевая информация, позволяющая быстро
            оценить текущую ситуацию.
          </p>

          <H3>Виджеты</H3>
          <ul className="space-y-1.5 ml-1">
            <Bullet>
              <strong>Новые лиды</strong> — количество заявок, полученных за
              последние 24 часа.
            </Bullet>
            <Bullet>
              <strong>Активные сделки</strong> — сделки на этапах «Новая»,
              «Показ», «Переговоры», «Договор».
            </Bullet>
            <Bullet>
              <strong>Задачи на сегодня</strong> — количество задач с дедлайном
              на текущий день.
            </Bullet>
            <Bullet>
              <strong>Общая сумма сделок</strong> — совокупная стоимость всех
              активных и закрытых сделок.
            </Bullet>
          </ul>

          <H3>Просроченные задачи</H3>
          <p>
            Если есть задачи с просроченным дедлайном, дашборд покажет
            напоминание с количеством таких задач. Это помогает не пропустить
            важные действия.
          </p>

          <Tip>
            Заглядывайте на дашборд каждое утро — это самый быстрый способ
            понять, на чём сфокусироваться сегодня.
          </Tip>
        </Section>

        {/* ──────── 2. LEADS ──────── */}
        <Section id="leads" icon={Users} title="Лиды">
          <p>
            Раздел «Лиды» — это управление заявками, которые поступают с сайта
            через форму обратной связи, а также создаются вручную.
          </p>

          <H3>Статусы лида</H3>
          <p>Каждый лид проходит через воронку статусов:</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <StatusChip label="Новый" color="bg-gray-100 text-gray-700" />
            <ArrowRight className="w-4 h-4 text-gray-300 self-center hidden sm:block" />
            <StatusChip label="Связался" color="bg-blue-50 text-blue-700" />
            <ArrowRight className="w-4 h-4 text-gray-300 self-center hidden sm:block" />
            <StatusChip
              label="Квалифицирован"
              color="bg-green-50 text-green-700"
            />
            <ArrowRight className="w-4 h-4 text-gray-300 self-center hidden sm:block" />
            <StatusChip label="Потерян" color="bg-red-50 text-red-700" />
          </div>

          <H3>Создание и редактирование</H3>
          <ul className="space-y-1.5 ml-1">
            <Bullet>
              Лиды автоматически создаются при отправке формы на сайте.
            </Bullet>
            <Bullet>
              Можно добавить лид вручную — нажмите кнопку «Быстрое добавление»
              и укажите имя и телефон.
            </Bullet>
            <Bullet>
              Для детального редактирования откройте лид и заполните все поля:
              email, источник, заметки.
            </Bullet>
            <Bullet>
              Статус меняется через выпадающее меню или при редактировании.
            </Bullet>
          </ul>

          <H3>Теги и сегментация</H3>
          <p>
            Каждому лиду можно назначить теги (например: «Покупатель», «Дорогой
            сегмент», «Петроградский район»). Теги помогают фильтровать и
            группировать лиды.
          </p>

          <H3>Импорт и экспорт</H3>
          <ul className="space-y-1.5 ml-1">
            <Bullet>
              <strong>Экспорт</strong> — скачайте все лиды в CSV-файл для
              работы в Excel или Google Таблицах.
            </Bullet>
            <Bullet>
              <strong>Импорт</strong> — загрузите CSV с лидами для массового
              добавления.
            </Bullet>
          </ul>

          <H3>Уведомления</H3>
          <p>
            При создании нового лида с сайта автоматически отправляется
            уведомление в Telegram и/или Max, если они настроены в разделе
            «Настройки».
          </p>

          <Note>
            Новые лиды из формы на сайте появляются автоматически — вам
            достаточно открыть раздел и связаться с клиентом.
          </Note>
        </Section>

        {/* ──────── 3. CLIENTS ──────── */}
        <Section id="clients" icon={UserCircle} title="Клиенты">
          <p>
            Раздел «Клиенты» содержит базу всех клиентов с полной историей
            взаимодействия. Если лид переведён в статус «Квалифицирован», из
            него можно создать клиента.
          </p>

          <H3>Привязка к лидам</H3>
          <p>
            Клиент связан с одним или несколькими лидами. Это позволяет видеть
            всю историю от первой заявки до текущего состояния.
          </p>

          <H3>Таймлайн активности</H3>
          <p>
            На странице клиента отображается таймлайн — хронология всех
            действий: создание лида, смена статуса, добавление задачи,
            создание сделки и т.д. Это помогает вспомнить контекст общения.
          </p>

          <H3>Теги</H3>
          <p>
            Теги работают так же, как у лидов, и позволяют сегментировать
            клиентскую базу: «VIP», «Инвестор», «Первый покупатель» и т.д.
          </p>

          <H3>Импорт и экспорт</H3>
          <p>
            Поддерживается массовый импорт и экспорт клиентов в CSV-формате.
          </p>

          <H3>Отправка сообщений</H3>
          <p>
            Через страницу клиента можно отправить сообщение в Telegram или
            Max — для этого нужно, чтобы каналы уведомлений были настроены в
            «Настройках».
          </p>

          <Tip>
            Регулярно обновляйте информацию о клиентах — чем точнее данные, тем
            лучше персонализированное обслуживание.
          </Tip>
        </Section>

        {/* ──────── 4. DEALS ──────── */}
        <Section id="deals" icon={Handshake} title="Сделки">
          <p>
            Раздел «Сделки» представляет собой канбан-доску, где каждая сделка
            отображается карточкой на соответствующем этапе.
          </p>

          <H3>Этапы сделки</H3>
          <div className="flex flex-wrap gap-2 mt-2">
            <StatusChip label="Новая" color="bg-gray-100 text-gray-700" />
            <ArrowRight className="w-4 h-4 text-gray-300 self-center hidden sm:block" />
            <StatusChip label="Показ" color="bg-blue-50 text-blue-700" />
            <ArrowRight className="w-4 h-4 text-gray-300 self-center hidden sm:block" />
            <StatusChip label="Переговоры" color="bg-yellow-50 text-yellow-700" />
            <ArrowRight className="w-4 h-4 text-gray-300 self-center hidden sm:block" />
            <StatusChip label="Договор" color="bg-purple-50 text-purple-700" />
            <ArrowRight className="w-4 h-4 text-gray-300 self-center hidden sm:block" />
            <StatusChip label="Успешно" color="bg-green-50 text-green-700" />
          </div>
          <div className="mt-1">
            <StatusChip label="Провалено" color="bg-red-50 text-red-700" />
          </div>

          <H3>Перемещение по этапам</H3>
          <p>
            Перетащите карточку сделки на другой столбец канбан-доски, либо
            откройте сделку и измените этап через выпадающее меню.
          </p>

          <H3>Привязка к объекту и клиенту</H3>
          <ul className="space-y-1.5 ml-1">
            <Bullet>
              <strong>Клиент</strong> — к каждой сделке привязан клиент из базы.
            </Bullet>
            <Bullet>
              <strong>Объект</strong> — выберите недвижимость из каталога.
            </Bullet>
          </ul>

          <H3>Автоматический расчёт комиссии</H3>
          <p>
            При закрытии сделки (переход на этап «Успешно») система
            автоматически рассчитывает сумму комиссии на основе процента,
            указанного в настройках. Комиссия отображается в карточке сделки.
          </p>

          <Warn>
            Убедитесь, что размер комиссии указан в «Настройках» до закрытия
            сделки — иначе расчёт будет некорректным.
          </Warn>
        </Section>

        {/* ──────── 5. PROPERTIES ──────── */}
        <Section id="properties" icon={Building2} title="Объекты">
          <p>
            Раздел «Объекты» — это каталог всей недвижимости, с которой вы
            работаете. Каждый объект содержит полную информацию для показа
            клиентам.
          </p>

          <H3>Добавление объекта</H3>
          <ul className="space-y-1.5 ml-1">
            <Bullet>
              <strong>Основная информация</strong> — адрес, тип (квартира, дом,
              участок), количество комнат, площадь, цена.
            </Bullet>
            <Bullet>
              <strong>Фотографии</strong> — загрузите одно или несколько фото
              объекта. Первое фото будет отображаться как обложка.
            </Bullet>
            <Bullet>
              <strong>Описание</strong> — подробный текст для показа клиенту.
            </Bullet>
          </ul>

          <H3>Статусы объекта</H3>
          <div className="flex flex-wrap gap-2 mt-2">
            <StatusChip label="Доступно" color="bg-green-50 text-green-700" />
            <StatusChip label="Бронь" color="bg-yellow-50 text-yellow-700" />
            <StatusChip label="Продано" color="bg-red-50 text-red-700" />
          </div>

          <H3>Счётчик дней на рынке</H3>
          <p>
            Система автоматически считает, сколько дней объект находится в
            каталоге. Это помогает отслеживать «зависшие» объекты и принимать
            решения об изменении цены.
          </p>

          <H3>Импорт с ЦИАН</H3>
          <p>
            Вы можете импортировать объекты с ЦИАН по ссылке на профиль. Для
            этого укажите ссылку на ваш ЦИАН-профиль в «Настройках», и система
            сможет подтягивать данные.
          </p>

          <Tip>
            Регулярно обновляйте статус объектов. Просроченные «Брони»
            замедляют работу — вовремя переводите в «Доступно» или «Продано».
          </Tip>
        </Section>

        {/* ──────── 6. TASKS ──────── */}
        <Section id="tasks" icon={CheckSquare} title="Задачи">
          <p>
            Раздел «Задачи» — это ваш планировщик, где собраны все дела:
            звонки, показы, отправка документов и прочее.
          </p>

          <H3>Создание задачи</H3>
          <ul className="space-y-1.5 ml-1">
            <Bullet>
              <strong>Название</strong> — краткое описание задачи.
            </Bullet>
            <Bullet>
              <strong>Описание</strong> — подробности (необязательно).
            </Bullet>
            <Bullet>
              <strong>Дедлайн</strong> — дата, к которой нужно выполнить задачу.
            </Bullet>
            <Bullet>
              <strong>Приоритет</strong> — низкий, средний, высокий.
            </Bullet>
          </ul>

          <H3>Привязка к лидам и сделкам</H3>
          <p>
            Задачу можно привязать к конкретному лиду или сделке. Это позволяет
            видеть контекст — например, «Позвонить по лину: Иванов».
          </p>

          <H3>Статусы задачи</H3>
          <div className="flex flex-wrap gap-2 mt-2">
            <StatusChip label="Ожидает" color="bg-gray-100 text-gray-700" />
            <StatusChip label="В работе" color="bg-blue-50 text-blue-700" />
            <StatusChip
              label="Выполнено"
              color="bg-green-50 text-green-700"
            />
          </div>

          <H3>Просроченные задачи</H3>
          <p>
            Если дедлайн прошёл, а задача не выполнена, она подсвечивается
            красным. На дашборде также отображается напоминание о количестве
            просроченных задач.
          </p>

          <Note>
            Привязывайте задачи к сделкам — так вы всегда будете знать, к
            какому объекту и клиенту относится задача.
          </Note>
        </Section>

        {/* ──────── 7. ANALYTICS ──────── */}
        <Section id="analytics" icon={BarChart3} title="Аналитика">
          <p>
            Раздел «Аналитика» предоставляет визуальные отчёты о работе CRM.
            Здесь вы можете оценить эффективность воронки продаж и
            проанализировать источники лидов.
          </p>

          <H3>Воронка лидов</H3>
          <p>
            Визуальная диаграмма показывает, сколько лидов находится на каждом
            этапе: «Новый» → «Связался» → «Квалифицирован» → «Потерян». Это
            позволяет увидеть, на каком этапе теряется больше всего заявок.
          </p>

          <H3>Графики по источникам</H3>
          <p>
            Диаграмма показывает распределение лидов по источникам: форма на
            сайте, ЦИАН, Авито, рекомендация и т.д. Помогает понять, какие
            каналы приносят больше всего клиентов.
          </p>

          <H3>Графики по статусам</H3>
          <p>
            Круговая или столбчатая диаграмма отображает текущее распределение
            лидов по статусам. Позволяет быстро оценить общую «температуру»
            воронки.
          </p>

          <Tip>
            Анализируйте аналитику раз в неделю — это поможет выявить тенденции
            и скорректировать стратегию привлечения клиентов.
          </Tip>
        </Section>

        {/* ──────── 8. TEMPLATES ──────── */}
        <Section id="templates" icon={MessageSquare} title="Шаблоны">
          <p>
            Раздел «Шаблоны» содержит заготовки сообщений для отправки через
            Telegram и Max. Шаблоны экономят время на рутинных коммуникациях.
          </p>

          <H3>Типы шаблонов</H3>
          <ul className="space-y-1.5 ml-1">
            <Bullet>
              <strong>Приветствие</strong> — первое сообщение новому лиду.
              Например: «Добрый день! Меня зовут Виктор, я риэлтор. Вы
              оставили заявку на сайте…»
            </Bullet>
            <Bullet>
              <strong>Показ</strong> — приглашение на показ объекта. Например:
              «Когда вам удобно посмотреть квартиру? Вот несколько вариантов…»
            </Bullet>
            <Bullet>
              <strong>Последующий контакт</strong> — follow-up после показа или
              встречи. Например: «Как вам квартира? Есть ли вопросы?»
            </Bullet>
            <Bullet>
              <strong>Поздравление</strong> — поздравление с успешной сделкой.
              Например: «Поздравляю с покупкой! Буду рад помочь в будущем…»
            </Bullet>
          </ul>

          <H3>Использование</H3>
          <p>
            При отправке сообщения клиенту из раздела «Лиды» или «Клиенты» вы
            можете выбрать шаблон и отправить его одним нажатием. Перед отправкой
            можно отредактировать текст.
          </p>

          <Note>
            Создайте свои шаблоны под стиль общения — персонализированные
            сообщения повышают доверие клиентов.
          </Note>
        </Section>

        {/* ──────── 9. REVIEWS ──────── */}
        <Section id="reviews" icon={Star} title="Отзывы">
          <p>
            Раздел «Отзывы» предназначен для управления отзывами, которые
            отображаются на сайте. Отзывы — важный инструмент привлечения
            клиентов.
          </p>

          <H3>Добавление отзыва</H3>
          <ul className="space-y-1.5 ml-1">
            <Bullet>
              <strong>Имя клиента</strong> — имя или инициалы.
            </Bullet>
            <Bullet>
              <strong>Текст отзыва</strong> — полный текст отзыва.
            </Bullet>
            <Bullet>
              <strong>Рейтинг</strong> — количество звёзд (от 1 до 5).
            </Bullet>
            <Bullet>
              <strong>Источник</strong> — откуда получен отзыв (Google, Яндекс,
              ЦИАН, лично и т.д.).
            </Bullet>
            <Bullet>
              <strong>Порядок сортировки</strong> — числовое поле для управления
              порядком отображения на сайте (меньше число = выше в списке).
            </Bullet>
          </ul>

          <H3>Скрытие и показ</H3>
          <p>
            Каждый отзыв можно скрыть с сайта (переключатель «Видимость»). При
            скрытии отзыв не удаляется — его можно снова показать в любой
            момент.
          </p>

          <H3>Редактирование</H3>
          <p>
            Вы можете отредактировать любой отзыв: исправить текст, изменить
            рейтинг или порядок. Это полезно, если клиент просит обновить
            отзыв.
          </p>

          <Tip>
            Добавляйте отзывы сразу после успешной сделки — в этот момент
            клиенты наиболее расположены оставить рекомендацию.
          </Tip>
        </Section>

        {/* ──────── 10. CASES ──────── */}
        <Section id="cases" icon={BookOpen} title="Кейсы">
          <p>
            Раздел «Кейсы» предназначен для публикации результатов работы на
            сайте. Кейс — это краткая история успешной сделки, которая
            демонстрирует вашу экспертизу.
          </p>

          <H3>Структура кейса</H3>
          <ul className="space-y-1.5 ml-1">
            <Bullet>
              <strong>Заголовок</strong> — краткое и цепляющее название.
              Например: «Двухкомнатная квартира на Петроградской стороне».
            </Bullet>
            <Bullet>
              <strong>Описание</strong> — рассказ о работе с клиентом: какие
              потребности были, как подбирали объект, какие трудности
              возникли.
            </Bullet>
            <Bullet>
              <strong>Результат</strong> — краткий итог. Например: «Продано за
              12 дней», «Сэкономили клиенту 1.5 млн ₽».
            </Bullet>
          </ul>

          <H3>Отображение на сайте</H3>
          <p>
            Кейсы публикуются на сайте в специальном разделе. Видимость
            кейсов можно настроить в разделе «Настройки» (переключатель
            «Кейсы»).
          </p>

          <Tip>
            Добавляйте конкретные цифры в результат — «Продано за 12 дней»
            работает лучше, чем «Быстро продали».
          </Tip>
        </Section>

        {/* ──────── 11. SETTINGS ──────── */}
        <Section id="settings" icon={Settings} title="Настройки">
          <p>
            Раздел «Настройки» — это центр конфигурации CRM и сайта. Здесь
            настраиваются все интеграции, контакты и параметры отображения.
          </p>

          <H3>Уведомления Telegram</H3>
          <p>
            Подключите Telegram-бота для получения мгновенных уведомлений о
            новых заявках и событиях в CRM.
          </p>
          <ul className="space-y-1.5 ml-1">
            <Bullet>
              <strong>Bot Token</strong> — токен вашего Telegram-бота
              (получается у @BotFather).
            </Bullet>
            <Bullet>
              <strong>Chat ID</strong> — ID чата или группы, куда бот будет
              отправлять уведомления.
            </Bullet>
          </ul>
          <Note>
            После настройки нажмите «Проверить» — при корректной конфигурации
            в чат придёт тестовое сообщение.
          </Note>

          <H3>Уведомления Max</H3>
          <p>
            Настройте webhook для отправки уведомлений в мессенджер Max.
          </p>
          <ul className="space-y-1.5 ml-1">
            <Bullet>
              <strong>Webhook URL</strong> — URL для отправки уведомлений.
            </Bullet>
          </ul>

          <H3>Социальные сети</H3>
          <p>
            Ссылки на ваши профили в социальных сетях отображаются на сайте:
          </p>
          <ul className="space-y-1.5 ml-1">
            <Bullet>
              <strong>Telegram</strong> — ссылка на канал или профиль.
            </Bullet>
            <Bullet>
              <strong>ВКонтакте</strong> — ссылка на сообщество или страницу.
            </Bullet>
            <Bullet>
              <strong>Instagram</strong> — ссылка на профиль.
            </Bullet>
            <Bullet>
              <strong>WhatsApp</strong> — ссылка для быстрой связи.
            </Bullet>
          </ul>

          <H3>Яндекс.Метрика</H3>
          <ul className="space-y-1.5 ml-1">
            <Bullet>
              <strong>ID счётчика</strong> — номер счётчика Яндекс.Метрики для
              отслеживания посещений сайта.
            </Bullet>
          </ul>

          <H3>Профиль ЦИАН</H3>
          <ul className="space-y-1.5 ml-1">
            <Bullet>
              <strong>URL профиля</strong> — ссылка на ваш профиль на ЦИАН.
              Отображается на сайте и используется для импорта объектов.
            </Bullet>
          </ul>

          <H3>Контакты</H3>
          <p>
            Контактная информация, отображаемая на сайте:
          </p>
          <ul className="space-y-1.5 ml-1">
            <Bullet>
              <strong>Телефон</strong> — основной номер для связи.
            </Bullet>
            <Bullet>
              <strong>Адрес офиса</strong> — физический адрес для встречи с
              клиентами.
            </Bullet>
          </ul>

          <H3>Профиль Max</H3>
          <ul className="space-y-1.5 ml-1">
            <Bullet>
              <strong>URL профиля</strong> — ссылка на ваш профиль в Max.
            </Bullet>
          </ul>

          <H3>Переключатели разделов сайта</H3>
          <p>
            В настройках можно включать и выключать разделы на сайте:
          </p>
          <ul className="space-y-1.5 ml-1">
            <Bullet>
              <strong>Отзывы</strong> — показать/скрыть блок отзывов на сайте.
            </Bullet>
            <Bullet>
              <strong>Кейсы</strong> — показать/скрыть блок кейсов на сайте.
            </Bullet>
            <Bullet>
              <strong>Статистика</strong> — показать/скрыть блок со статистикой
              (количество сделок, лет опыта и т.д.).
            </Bullet>
          </ul>

          <H3>Размер комиссии</H3>
          <p>
            Укажите процент комиссии — он используется для автоматического
            расчёта при закрытии сделок в разделе «Сделки».
          </p>

          <H3>Смена пароля</H3>
          <p>
            В самом низу страницы настроек находится форма смены пароля от CRM.
            Укажите текущий пароль, затем новый и его подтверждение.
          </p>

          <Warn>
            Сохраняйте токен Telegram-бота в безопасности — он даёт полный
            доступ к отправке сообщений от имени бота.
          </Warn>
        </Section>

        {/* ── footer ── */}
        <div className="text-center text-sm text-gray-400 pt-6 pb-12 border-t border-gray-200">
          Гайд по CRM &middot; РАТНИКОВ/недвижимость
        </div>
      </div>
    </div>
  );
}