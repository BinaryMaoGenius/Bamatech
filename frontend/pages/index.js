import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Carousel from "../components/Carousel";
import {
  fallbackActors,
  fallbackKpi,
  fallbackNews,
  fallbackResources,
  fallbackServices,
  fallbackTrainings
} from "../data/fallback";

const DEFAULT_API_BASE_URL = "http://localhost:4000/api";

async function fetchFromApi(baseUrl, endpoint) {
  try {
    const response = await fetch(`${baseUrl}${endpoint}`);

    if (!response.ok) {
      throw new Error(`Failed request with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.warn(`Unable to fetch ${endpoint}:`, error.message);
    return null;
  }
}

export async function getServerSideProps() {
  const apiBaseUrl =
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    DEFAULT_API_BASE_URL;

  const [news, actors, resources, trainings, services, kpi] = await Promise.all(
    [
      fetchFromApi(apiBaseUrl, "/news"),
      fetchFromApi(apiBaseUrl, "/actors"),
      fetchFromApi(apiBaseUrl, "/resources"),
      fetchFromApi(apiBaseUrl, "/trainings"),
      fetchFromApi(apiBaseUrl, "/services"),
      fetchFromApi(apiBaseUrl, "/kpi")
    ]
  );

  return {
    props: {
      initialData: {
        news: news ?? fallbackNews,
        actors: actors ?? fallbackActors,
        resources: resources ?? fallbackResources,
        trainings: trainings ?? fallbackTrainings,
        services: services ?? fallbackServices,
        kpi: kpi ?? fallbackKpi
      }
    }
  };
}

export default function Home({ initialData }) {
  const apiBaseUrl = useMemo(
    () =>
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      process.env.API_BASE_URL ||
      DEFAULT_API_BASE_URL,
    []
  );

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedTheme =
      typeof window !== "undefined"
        ? window.localStorage.getItem("bamatech-theme")
        : null;

    if (storedTheme === "dark") {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.classList.toggle("dark-mode", isDarkMode);
    }

    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        "bamatech-theme",
        isDarkMode ? "dark" : "light"
      );
    }
  }, [isDarkMode]);

  useEffect(() => {
    function handleScroll() {
      const doc = document.documentElement;
      const totalHeight = doc.scrollHeight - doc.clientHeight;
      const scrolled = (window.scrollY / totalHeight) * 100;
      setScrollProgress(Number.isFinite(scrolled) ? scrolled : 0);
    }

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function refreshData() {
      setIsLoading(true);

      const endpoints = [
        ["news", "/news", fallbackNews],
        ["actors", "/actors", fallbackActors],
        ["resources", "/resources", fallbackResources],
        ["trainings", "/trainings", fallbackTrainings],
        ["services", "/services", fallbackServices],
        ["kpi", "/kpi", fallbackKpi]
      ];

      const results = await Promise.all(
        endpoints.map(async ([key, endpoint, fallback]) => {
          const response = await fetchFromApi(apiBaseUrl, endpoint);
          return [key, response ?? fallback];
        })
      );

      setData((previous) => ({
        ...previous,
        ...Object.fromEntries(results)
      }));
      setIsLoading(false);
    }

    refreshData();
  }, [apiBaseUrl]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const filteredActors = useMemo(() => {
    if (!searchQuery.trim()) {
      return data.actors;
    }

    const normalizedQuery = searchQuery.toLowerCase();

    return data.actors.filter((actor) =>
      [actor.name, actor.description, ...(actor.tags ?? [])]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [data.actors, searchQuery]);

  return (
    <>
      <Head>
        <title>Bamatech - Le Numérique au Service du Mali</title>
        <meta
          name="description"
          content="Plateforme numérique malienne connectant acteurs, ressources et services TIC"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb6xLS3VY6EIMr1YhKZ7f0Z2Q5xkaD4YxIC4WOW=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </Head>

      <div className="progress-container" aria-hidden="true">
        <div
          className="progress-bar"
          style={{ width: `${Math.min(scrollProgress, 100)}%` }}
        />
      </div>

      <div className="loader" style={{ opacity: isLoading ? 1 : 0, visibility: isLoading ? "visible" : "hidden" }}>
        <div className="loader-spinner" />
      </div>

      <button
        id="menu-btn"
        className="control-btn"
        type="button"
        onClick={() => setIsSidebarOpen((open) => !open)}
        aria-expanded={isSidebarOpen}
        aria-controls="sidebar"
      >
        <i className="fas fa-bars" />
      </button>

      <button
        id="dark-mode-toggle"
        className="control-btn"
        type="button"
        onClick={() => setIsDarkMode((value) => !value)}
        aria-pressed={isDarkMode}
      >
        <i className={`fas fa-${isDarkMode ? "sun" : "moon"}`} />
      </button>

      <nav id="sidebar" className={isSidebarOpen ? "open" : ""}>
        <a href="#actualites">
          <i className="fas fa-newspaper" /> Actualités
        </a>
        <a href="#acteurs">
          <i className="fas fa-users" /> Acteurs
        </a>
        <a href="#ressources">
          <i className="fas fa-book" /> Ressources
        </a>
        <a href="#formations">
          <i className="fas fa-graduation-cap" /> Formations
        </a>
        <a href="#services">
          <i className="fas fa-cogs" /> Services
        </a>
        <a href="#contact">
          <i className="fas fa-envelope" /> Contact
        </a>
      </nav>

      <main className={`main ${isSidebarOpen ? "sidebar-open" : ""}`}>
        <div className="container">
          <header>
            <h1>Bamatech</h1>
            <p>La plateforme qui connecte le Mali au futur numérique</p>
            <div className="search-container">
              <input
                type="search"
                placeholder="Rechercher des acteurs, formations, ressources..."
                aria-label="Rechercher"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
              <button type="button">
                <i className="fas fa-search" />
              </button>
            </div>
          </header>

          <section id="actualites">
            <h2 className="section-title">Actualités TIC</h2>
            <Carousel items={data.news} />

            <div className="card" style={{ marginTop: "1.5rem" }}>
              <div className="card-content">
                <h3>Dernières nouvelles</h3>
                <ul style={{ listStyleType: "none" }}>
                  {data.news.map((item) => (
                    <li
                      key={item.id}
                      style={{
                        padding: "0.5rem 0",
                        borderBottom: "1px solid #eee"
                      }}
                    >
                      <i
                        className="fas fa-circle"
                        style={{
                          color: "var(--primary-color)",
                          fontSize: "0.6rem",
                          marginRight: "0.5rem"
                        }}
                      />
                      <strong>{item.title}</strong>
                      <br />
                      <small>
                        {new Date(item.date).toLocaleDateString("fr-FR")}
                        {item.location ? ` • ${item.location}` : ""}
                      </small>
                    </li>
                  ))}
                </ul>
                <button className="card-btn" type="button">
                  <i className="fas fa-newspaper" /> Voir toutes les actualités
                </button>
              </div>
            </div>
          </section>

          <section id="acteurs" style={{ marginTop: "3rem" }}>
            <h2 className="section-title">Acteurs &amp; Partenaires</h2>
            <Image
              src="https://source.unsplash.com/1100x350/?network,africa"
              alt="Acteurs du numérique au Mali"
              width={1100}
              height={350}
              className="section-img"
            />

            <div className="grid">
              {filteredActors.map((actor) => (
                <article className="card" key={actor.id}>
                  <Image
                    src={actor.image}
                    alt={actor.name}
                    width={300}
                    height={200}
                  />
                  <div className="card-content">
                    <h3>{actor.name}</h3>
                    <p>{actor.description}</p>
                    <div style={{ marginTop: "0.8rem" }}>
                      {actor.tags?.map((tag) => (
                        <span className="badge" key={tag}>
                          <i className="fas fa-circle" /> {tag}
                        </span>
                      ))}
                    </div>
                    <button className="card-btn" type="button">
                      <i className="fas fa-eye" /> Voir profil
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="ressources" style={{ marginTop: "3rem" }}>
            <h2 className="section-title">Ressources Stratégiques</h2>
            <div className="grid">
              {data.resources.map((resource) => (
                <article className="card" key={resource.id}>
                  <div className="card-content">
                    <h3>{resource.title}</h3>
                    <p>Format : {resource.type}</p>
                    <button className="card-btn" type="button">
                      <i className="fas fa-download" /> Télécharger
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="formations" style={{ marginTop: "3rem" }}>
            <h2 className="section-title">Formations &amp; Programmes</h2>
            <div className="grid">
              {data.trainings.map((training) => (
                <article className="card" key={training.id}>
                  <div className="card-content">
                    <h3>{training.title}</h3>
                    <p>{training.provider}</p>
                    <p>Mode : {training.mode}</p>
                    <p>
                      Début : {" "}
                      {new Date(training.startDate).toLocaleDateString("fr-FR")}
                    </p>
                    <button className="card-btn" type="button">
                      <i className="fas fa-calendar" /> S'inscrire
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="services" style={{ marginTop: "3rem" }}>
            <h2 className="section-title">Services d'accompagnement</h2>
            <div className="services-grid">
              {data.services.map((service) => (
                <article className="service-card" key={service.id}>
                  <div className="service-icon">
                    <i className={`fas fa-${service.icon}`} aria-hidden="true" />
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <button className="card-btn" type="button">
                    <i className="fas fa-arrow-right" /> Découvrir
                  </button>
                </article>
              ))}
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <span>{data.kpi.entrepreneursSupported}</span>
                Entrepreneurs accompagnés
              </div>
              <div className="stat-card">
                <span>{data.kpi.trainingsDelivered}</span>
                Formations délivrées
              </div>
              <div className="stat-card">
                <span>{data.kpi.partnerProjects}</span>
                Projets partenaires
              </div>
              <div className="stat-card">
                <span>{data.kpi.satisfactionRate}%</span>
                Taux de satisfaction
              </div>
            </div>
          </section>

          <section id="contact" style={{ marginTop: "3rem" }}>
            <h2 className="section-title">Contact &amp; Communauté</h2>
            <div className="highlight">
              <Image
                src="https://source.unsplash.com/600x400/?coworking,africa"
                alt="Communauté tech au Mali"
                width={600}
                height={400}
              />
              <div className="highlight-content">
                <div className="contact-card">
                  <h3>Rejoignez la communauté Bamatech</h3>
                  <p>
                    Abonnez-vous à notre newsletter et recevez chaque mois une
                    veille sur les opportunités numériques.
                  </p>
                  <a href="mailto:contact@bamatech.ml">
                    <i className="fas fa-envelope" /> contact@bamatech.ml
                  </a>
                  <a href="tel:+22370000000">
                    <i className="fas fa-phone" /> +223 70 00 00 00
                  </a>
                  <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                    <a href="https://www.facebook.com" aria-label="Facebook">
                      <i className="fab fa-facebook" />
                    </a>
                    <a href="https://www.linkedin.com" aria-label="LinkedIn">
                      <i className="fab fa-linkedin" />
                    </a>
                    <a href="https://www.twitter.com" aria-label="Twitter">
                      <i className="fab fa-x-twitter" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <footer className="footer">
            <p>
              © {new Date().getFullYear()} Bamatech. Accélérons la transformation
              numérique du Mali.
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}
