import type { Locale } from "@/lib/i18n/config";
import type { WikiSectionId } from "@/lib/wiki";

export type Dictionary = {
  meta: {
    siteTitle: string;
    siteDescription: string;
  };
  nav: {
    countries: string;
    people: string;
    volunteering: string;
    events: string;
    partners: string;
    assistant: string;
    login: string;
    openMenu: string;
    closeMenu: string;
    language: string;
  };
  theme: {
    toDark: string;
    toLight: string;
    dark: string;
    light: string;
  };
  intro: {
    title: string;
    lead: string;
    cta: string;
  };
  map: {
    zoomIn: string;
    zoomOut: string;
    randomCountry: string;
    filters: string;
    filtersAria: string;
    filtersTitle: string;
    reset: string;
    showTemperature: string;
    hideTemperature: string;
    loading: string;
    temperature: string;
    tempScale: string;
    tempHint: string;
    tempFailed: string;
    searchLabel: string;
    searchPlaceholder: string;
    clearSearch: string;
    noCountry: string;
    notInCatalog: string;
    closeCard: string;
    goToCountry: string;
    countryInfo: string;
    unknownCountry: string;
    beach: string;
    ski: string;
    tempBelow20: string;
    tempNeg20Neg10: string;
    tempNeg10Zero: string;
    temp0_10: string;
    temp10_20: string;
    temp20_25: string;
    temp25_30: string;
    tempAbove30: string;
  };
  catalog: {
    eyebrow: string;
    title: string;
    lead: string;
    searchLabel: string;
    searchPlaceholder: string;
    found: string;
    allRegions: string;
    region: string;
    openCountry: string;
    nothingFound: string;
    tryChangeSearch: string;
    briefLead: string;
    briefLanguage: string;
  };
  country: {
    countries: string;
    onMap: string;
    masters: string;
    verified: string;
    emptyWiki: string;
    usefulLinks: string;
    atHand: string;
    videos: string;
    watch: string;
    relocation: string;
    tourism: string;
    youtubePlaylist: string;
    youtube: string;
    notFoundTitle: string;
  };
  wiki: {
    sections: Record<WikiSectionId, { title: string; summary: string }>;
    groups: {
      start: string;
      status: string;
      daily: string;
      work: string;
      more: string;
    };
    facts: {
      area: string;
      population: string;
      languages: string;
      religion: string;
      government: string;
    };
    guideTitle: string;
    guideToThePoint: string;
    showSection: string;
    hideSection: string;
    openSections: string;
    closeSections: string;
    backToTop: string;
    placeholder: string;
  };
  aside: Record<string, never>;
  placeholders: {
    peopleTitle: string;
    peopleDescription: string;
    peopleCountryTitle: string;
    peopleCountryDescription: string;
    toCountry: string;
    toMap: string;
    volunteeringTitle: string;
    volunteeringDescription: string;
    eventsTitle: string;
    eventsDescription: string;
    partnersTitle: string;
    partnersDescription: string;
    communityTitle: string;
    communityDescription: string;
    notFoundTitle: string;
    notFoundDescription: string;
  };
  auth: {
    title: string;
    lead: string;
    demo: string;
    continue: string;
    signedIn: string;
    signOut: string;
    toAssistant: string;
    toCountries: string;
  };
  assistant: {
    title: string;
    subtitle: string;
    name: string;
    placeholder: string;
    send: string;
    thinking: string;
    loading: string;
    newChat: string;
    history: string;
    closeChat: string;
    openFullChat: string;
    messageLabel: string;
    tip: string;
    greeting: string;
    openChat: string;
    askSakura: string;
    hideSakura: string;
  };
  months: string[];
};

export const dictionaries: Record<Locale, Dictionary> = {
  ru: {
    meta: {
      siteTitle: "Worldwide WIKI — база знаний о странах мира",
      siteDescription:
        "Каталог стран, специалистов, волонтёрских проектов и сообщества путешественников.",
    },
    nav: {
      countries: "Страны",
      people: "Люди",
      volunteering: "Волонтёрство",
      events: "Афиша",
      partners: "Партнёры",
      assistant: "Ассистент",
      login: "Войти",
      openMenu: "Открыть меню",
      closeMenu: "Закрыть меню",
      language: "Язык сайта",
    },
    theme: {
      toDark: "Включить тёмную тему",
      toLight: "Включить светлую тему",
      dark: "Тёмная тема",
      light: "Светлая тема",
    },
    intro: {
      title: "Исследуй мир по-новому",
      lead: "Находи страны, людей, полезные сервисы и события на одной интерактивной карте.",
      cta: "Начать путешествие",
    },
    map: {
      zoomIn: "Увеличить карту",
      zoomOut: "Уменьшить карту",
      randomCountry: "случайная страна",
      filters: "фильтры",
      filtersAria: "Фильтры карты",
      filtersTitle: "Фильтры",
      reset: "Сбросить",
      showTemperature: "Показать температуру",
      hideTemperature: "Скрыть температуру",
      loading: "Загрузка…",
      temperature: "Температура",
      tempScale: "Шкала °C",
      tempHint: "Тепловая карта по суше (Open-Meteo)",
      tempFailed: "Не удалось загрузить температуру",
      searchLabel: "Выберите страну",
      searchPlaceholder: "Найти страну в каталоге",
      clearSearch: "Очистить поиск",
      noCountry: "В каталоге пока нет такой страны.",
      notInCatalog: "«{name}» пока нет в базе",
      closeCard: "Закрыть карточку страны",
      goToCountry: "Перейти к стране",
      countryInfo: "Информация о стране {name}",
      unknownCountry: "Неизвестная страна",
      beach: "Пляжный отдых",
      ski: "Горнолыжные курорты",
      tempBelow20: "ниже −20°",
      tempNeg20Neg10: "−20…−10°",
      tempNeg10Zero: "−10…0°",
      temp0_10: "0…10°",
      temp10_20: "10…20°",
      temp20_25: "20…25°",
      temp25_30: "25…30°",
      tempAbove30: "выше 30°",
    },
    catalog: {
      eyebrow: "База знаний",
      title: "Страны мира",
      lead: "Изучай направления, сравнивай условия и находи информацию для путешествий, переезда, учёбы и жизни в другой стране.",
      searchLabel: "Поиск по странам",
      searchPlaceholder: "Например, Грузия",
      found: "Найдено стран: {count}",
      allRegions: "Все регионы",
      region: "Регион",
      openCountry: "Открыть",
      nothingFound: "Ничего не найдено",
      tryChangeSearch:
        "Попробуй изменить поисковый запрос или выбрать другой регион.",
      briefLead:
        "{name} — страна в регионе {region}. Столица — {capital}. Основные языки: {languages}.",
      briefLanguage: "{name}",
    },
    country: {
      countries: "Страны",
      onMap: "На карте",
      masters: "Мастера",
      verified: "проверено {date}",
      emptyWiki:
        "Подробные разделы для {name} ещё собираем. Пока смотри описание выше или открой страну на карте.",
      usefulLinks: "Полезные ссылки",
      atHand: "Под рукой",
      videos: "Видео",
      watch: "Смотреть",
      relocation: "переезд",
      tourism: "туризм",
      youtubePlaylist: "Подборка на YouTube",
      youtube: "YouTube",
      notFoundTitle: "Страна не найдена — Worldwide WIKI",
    },
    wiki: {
      sections: {
        overview: { title: "Кратко", summary: "Суть и устройство страны" },
        visa: { title: "Как въехать", summary: "Безвиз, виза, граница" },
        before: { title: "Перед поездкой", summary: "Документы и важное" },
        cities: { title: "Где жить", summary: "Города и климат" },
        health: { title: "Медицина", summary: "Страховка и клиники" },
        residence: { title: "ВНЖ", summary: "Разрешение на проживание" },
        status: { title: "ПМЖ и паспорт", summary: "Долгий статус" },
        housing: { title: "Жильё", summary: "Аренда, покупка, ЖКХ" },
        banking: { title: "Деньги", summary: "Счёт, карты, переводы" },
        connectivity: { title: "Связь", summary: "SIM и интернет" },
        transport: { title: "Транспорт", summary: "Город и между городами" },
        work: { title: "Работа", summary: "Найм и право на труд" },
        business: { title: "Бизнес", summary: "ИП и компании" },
        education: { title: "Учёба", summary: "Школы, вузы, язык" },
        animals: { title: "Животные", summary: "Питомцы" },
        communities: { title: "Сообщества", summary: "Чаты и группы" },
        gov: { title: "Госорганы", summary: "Официальные сайты" },
        law: { title: "Законы", summary: "Нормы и источники" },
        videos: { title: "Видео", summary: "Что посмотреть" },
      },
      groups: {
        start: "Старт",
        status: "Статус",
        daily: "Быт",
        work: "Дело",
        more: "Ещё",
      },
      facts: {
        area: "Размер",
        population: "Население",
        languages: "Языки",
        religion: "Религия",
        government: "Власть",
      },
      guideTitle: "Разделы статьи",
      guideToThePoint: "По делу",
      showSection: "Показать: {title}",
      hideSection: "Скрыть: {title}",
      openSections: "Открыть разделы",
      closeSections: "Закрыть разделы",
      backToTop: "Наверх",
      placeholder: "Раздел «{title}» для страны {name} появится позже.",
    },
    aside: {},
    placeholders: {
      peopleTitle: "Люди",
      peopleDescription:
        "Маркетплейс мастеров и исполнителей: фильтр по стране, языку общения и отзывам.",
      peopleCountryTitle: "Мастера: {name}",
      peopleCountryDescription:
        "Маркетплейс исполнителей для страны {name} появится на следующем этапе. Там будут фильтры по стране, языку общения и отзывам.",
      toCountry: "К странице {name}",
      toMap: "На карту",
      volunteeringTitle: "Волонтёрство",
      volunteeringDescription:
        "Раздел волонтёрских проектов появится на следующем этапе.",
      eventsTitle: "Афиша",
      eventsDescription: "События и встречи появятся на следующем этапе.",
      partnersTitle: "Партнёры",
      partnersDescription: "Партнёрская витрина появится на следующем этапе.",
      communityTitle: "Сообщество",
      communityDescription: "Сообщество путешественников появится позже.",
      notFoundTitle: "Страница не найдена",
      notFoundDescription:
        "Такого раздела пока нет. Вернись на карту и выбери страну из каталога.",
    },
    auth: {
      title: "Вход",
      lead: "Полный кабинет подключим позже. Пока можно включить демо-вход на этом устройстве.",
      demo: "Войти (демо)",
      continue: "Продолжить без входа",
      signedIn: "Вы вошли (демо).",
      signOut: "Выйти",
      toAssistant: "К ассистенту",
      toCountries: "К каталогу стран",
    },
    assistant: {
      title: "Ассистент Sakura",
      subtitle: "WW Ассистент",
      name: "Сакура",
      placeholder: 'Например, «Хочу отдохнуть на море»',
      send: "Отправить",
      thinking: "Думаю…",
      loading: "Загрузка ассистента…",
      newChat: "Новый чат",
      history: "История",
      closeChat: "Закрыть чат",
      openFullChat: "Открыть полный чат",
      messageLabel: "Сообщение ассистенту",
      tip: "Задай мне свой вопрос",
      greeting:
        "Привет! Задай мне вопрос — соберу ответ из базы Worldwide WIKI.",
      openChat: "Открыть чат с Сакурой",
      askSakura: "Задать вопрос Сакуре",
      hideSakura: "Скрыть Сакуру",
    },
    months: [
      "января",
      "февраля",
      "марта",
      "апреля",
      "мая",
      "июня",
      "июля",
      "августа",
      "сентября",
      "октября",
      "ноября",
      "декабря",
    ],
  },
  en: {
    meta: {
      siteTitle: "Worldwide WIKI — country knowledge base",
      siteDescription:
        "A catalog of countries, specialists, volunteering projects, and traveler community.",
    },
    nav: {
      countries: "Countries",
      people: "People",
      volunteering: "Volunteering",
      events: "Events",
      partners: "Partners",
      assistant: "Assistant",
      login: "Sign in",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      language: "Site language",
    },
    theme: {
      toDark: "Switch to dark theme",
      toLight: "Switch to light theme",
      dark: "Dark theme",
      light: "Light theme",
    },
    intro: {
      title: "Explore the world in a new way",
      lead: "Find countries, people, useful services, and events on one interactive map.",
      cta: "Start the journey",
    },
    map: {
      zoomIn: "Zoom in",
      zoomOut: "Zoom out",
      randomCountry: "random country",
      filters: "filters",
      filtersAria: "Map filters",
      filtersTitle: "Filters",
      reset: "Reset",
      showTemperature: "Show temperature",
      hideTemperature: "Hide temperature",
      loading: "Loading…",
      temperature: "Temperature",
      tempScale: "Scale °C",
      tempHint: "Land heatmap (Open-Meteo)",
      tempFailed: "Could not load temperature",
      searchLabel: "Choose a country",
      searchPlaceholder: "Find a country in the catalog",
      clearSearch: "Clear search",
      noCountry: "No such country in the catalog yet.",
      notInCatalog: "“{name}” is not in the database yet",
      closeCard: "Close country card",
      goToCountry: "Go to country",
      countryInfo: "About {name}",
      unknownCountry: "Unknown country",
      beach: "Beach holidays",
      ski: "Ski resorts",
      tempBelow20: "below −20°",
      tempNeg20Neg10: "−20…−10°",
      tempNeg10Zero: "−10…0°",
      temp0_10: "0…10°",
      temp10_20: "10…20°",
      temp20_25: "20…25°",
      temp25_30: "25…30°",
      tempAbove30: "above 30°",
    },
    catalog: {
      eyebrow: "Knowledge base",
      title: "Countries of the world",
      lead: "Explore destinations, compare conditions, and find what you need for travel, relocation, study, and life abroad.",
      searchLabel: "Search countries",
      searchPlaceholder: "For example, Georgia",
      found: "Countries found: {count}",
      allRegions: "All regions",
      region: "Region",
      openCountry: "Open",
      nothingFound: "Nothing found",
      tryChangeSearch: "Try another search query or pick a different region.",
      briefLead:
        "{name} is in {region}. Capital: {capital}. Main languages: {languages}.",
      briefLanguage: "{name}",
    },
    country: {
      countries: "Countries",
      onMap: "On the map",
      masters: "Masters",
      verified: "verified {date}",
      emptyWiki:
        "Detailed sections for {name} are still being written. Check the overview above or open the country on the map.",
      usefulLinks: "Useful links",
      atHand: "At hand",
      videos: "Videos",
      watch: "Watch",
      relocation: "relocation",
      tourism: "travel",
      youtubePlaylist: "Open on YouTube",
      youtube: "YouTube",
      notFoundTitle: "Country not found — Worldwide WIKI",
    },
    wiki: {
      sections: {
        overview: { title: "At a glance", summary: "What the country is like" },
        visa: { title: "How to enter", summary: "Visa-free, visas, border" },
        before: { title: "Before you go", summary: "Documents and essentials" },
        cities: { title: "Where to live", summary: "Cities and climate" },
        health: { title: "Healthcare", summary: "Insurance and clinics" },
        residence: { title: "Residence permit", summary: "Legal stay" },
        status: { title: "PR and passport", summary: "Long-term status" },
        housing: { title: "Housing", summary: "Rent, buy, utilities" },
        banking: { title: "Money", summary: "Accounts, cards, transfers" },
        connectivity: { title: "Connectivity", summary: "SIM and internet" },
        transport: { title: "Transport", summary: "City and intercity" },
        work: { title: "Work", summary: "Hiring and work rights" },
        business: { title: "Business", summary: "Companies and tax" },
        education: { title: "Study", summary: "Schools, universities, language" },
        animals: { title: "Pets", summary: "Animals and travel" },
        communities: { title: "Communities", summary: "Chats and groups" },
        gov: { title: "Government", summary: "Official sites" },
        law: { title: "Laws", summary: "Rules and sources" },
        videos: { title: "Videos", summary: "What to watch" },
      },
      groups: {
        start: "Start",
        status: "Status",
        daily: "Daily life",
        work: "Work",
        more: "More",
      },
      facts: {
        area: "Size",
        population: "Population",
        languages: "Languages",
        religion: "Religion",
        government: "Government",
      },
      guideTitle: "Article sections",
      guideToThePoint: "Essentials",
      showSection: "Show: {title}",
      hideSection: "Hide: {title}",
      openSections: "Open sections",
      closeSections: "Close sections",
      backToTop: "Back to top",
      placeholder: "The “{title}” section for {name} will appear later.",
    },
    aside: {},
    placeholders: {
      peopleTitle: "People",
      peopleDescription:
        "A marketplace of masters and freelancers with filters by country, language, and reviews.",
      peopleCountryTitle: "Masters: {name}",
      peopleCountryDescription:
        "The marketplace for {name} will arrive in a later release, with filters by country, language, and reviews.",
      toCountry: "To {name} page",
      toMap: "To the map",
      volunteeringTitle: "Volunteering",
      volunteeringDescription:
        "The volunteering projects section will arrive in a later release.",
      eventsTitle: "Events",
      eventsDescription: "Events and meetups will arrive in a later release.",
      partnersTitle: "Partners",
      partnersDescription: "The partners showcase will arrive in a later release.",
      communityTitle: "Community",
      communityDescription: "The traveler community will arrive later.",
      notFoundTitle: "Page not found",
      notFoundDescription:
        "This section doesn’t exist yet. Go back to the map and pick a country from the catalog.",
    },
    auth: {
      title: "Sign in",
      lead: "A full account area will come later. For now you can use demo sign-in on this device.",
      demo: "Sign in (demo)",
      continue: "Continue without signing in",
      signedIn: "You are signed in (demo).",
      signOut: "Sign out",
      toAssistant: "To assistant",
      toCountries: "To countries catalog",
    },
    assistant: {
      title: "Sakura assistant",
      subtitle: "WW Assistant",
      name: "Sakura",
      placeholder: 'For example, “I want a beach holiday”',
      send: "Send",
      thinking: "Thinking…",
      loading: "Loading assistant…",
      newChat: "New chat",
      history: "History",
      closeChat: "Close chat",
      openFullChat: "Open full chat",
      messageLabel: "Message to assistant",
      tip: "Ask me a question",
      greeting:
        "Hi! Ask me a question — I’ll pull an answer from the Worldwide WIKI base.",
      openChat: "Open chat with Sakura",
      askSakura: "Ask Sakura a question",
      hideSakura: "Hide Sakura",
    },
    months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
  },
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export function translate(
  dictionary: Dictionary,
  path: string,
  vars?: Record<string, string | number>,
): string {
  const parts = path.split(".");
  let current: unknown = dictionary;

  for (const part of parts) {
    if (!current || typeof current !== "object") {
      return path;
    }
    current = (current as Record<string, unknown>)[part];
  }

  if (typeof current !== "string") {
    return path;
  }

  if (!vars) {
    return current;
  }

  return current.replace(/\{(\w+)\}/g, (_, key: string) =>
    vars[key] !== undefined ? String(vars[key]) : `{${key}}`,
  );
}
