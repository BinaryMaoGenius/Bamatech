import Head from "next/head";
import { useMemo, useState } from "react";
import styles from "../styles/Dashboard.module.css";
import {
  fallbackActors,
  fallbackAdminMessages,
  fallbackAdminMetrics,
  fallbackAdminUsers,
  fallbackNews,
  fallbackResources,
  fallbackTrainings
} from "../data/fallback";
import { useEffect } from "react";

const DEFAULT_API_BASE_URL = "http://localhost:4000/api";

async function fetchFromApi(baseUrl, endpoint) {
  try {
    const response = await fetch(`${baseUrl}${endpoint}`);
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
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

  const [news, actors, trainings, resources, metrics, messages, users] =
    await Promise.all([
      fetchFromApi(apiBaseUrl, "/news"),
      fetchFromApi(apiBaseUrl, "/actors"),
      fetchFromApi(apiBaseUrl, "/trainings"),
      fetchFromApi(apiBaseUrl, "/resources"),
      fetchFromApi(apiBaseUrl, "/dashboard/metrics"),
      fetchFromApi(apiBaseUrl, "/dashboard/messages"),
      fetchFromApi(apiBaseUrl, "/dashboard/users")
    ]);

  return {
    props: {
      initialData: {
        news: news ?? fallbackNews,
        actors: actors ?? fallbackActors,
        trainings: trainings ?? fallbackTrainings,
        resources: resources ?? fallbackResources,
        metrics: metrics ?? fallbackAdminMetrics,
        messages: messages ?? fallbackAdminMessages,
        users: users ?? fallbackAdminUsers
      }
    }
  };
}

export default function Dashboard({ initialData }) {
  const apiBaseUrl = useMemo(
    () =>
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      process.env.API_BASE_URL ||
      DEFAULT_API_BASE_URL,
    []
  );

  const [data, setData] = useState(initialData);

  useEffect(() => {
    async function refreshData() {
      const [metrics, messages, users] = await Promise.all([
        fetchFromApi(apiBaseUrl, "/dashboard/metrics"),
        fetchFromApi(apiBaseUrl, "/dashboard/messages"),
        fetchFromApi(apiBaseUrl, "/dashboard/users")
      ]);

      setData((previous) => ({
        ...previous,
        metrics: metrics ?? previous.metrics,
        messages: messages ?? previous.messages,
        users: users ?? previous.users
      }));
    }

    refreshData();
  }, [apiBaseUrl]);

  const stats = [
    {
      label: "Visiteurs Totaux",
      value: data.metrics.totalVisitors,
      icon: "fa-chart-line"
    },
    { label: "Nouvelles Actualités", value: data.metrics.newNews, icon: "fa-newspaper" },
    { label: "Messages Non Lus", value: data.metrics.unreadMessages, icon: "fa-envelope" },
    { label: "Nouveaux Acteurs", value: data.metrics.newActors, icon: "fa-users" }
  ];

  return (
    <div className={styles.dashboardPage}>
      <Head>
        <title>Bamatech - Tableau de Bord</title>
        <meta
          name="description"
          content="Tableau de bord administrateur pour piloter la plateforme Bamatech"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb6xLS3VY6EIMr1YhKZ7f0Z2Q5xkaD4YxIC4WOW=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </Head>

      <aside className={styles.sidebar}>
        <a className={styles.sidebarLink} href="#dashboard">
          <i className="fas fa-tachometer-alt" /> Tableau de bord
        </a>
        <a className={styles.sidebarLink} href="#actualites">
          <i className="fas fa-newspaper" /> Actualités
        </a>
        <a className={styles.sidebarLink} href="#acteurs">
          <i className="fas fa-users" /> Acteurs
        </a>
        <a className={styles.sidebarLink} href="#formations">
          <i className="fas fa-graduation-cap" /> Formations
        </a>
        <a className={styles.sidebarLink} href="#ressources">
          <i className="fas fa-book" /> Ressources
        </a>
        <a className={styles.sidebarLink} href="#messages">
          <i className="fas fa-envelope" /> Messages
        </a>
        <a className={styles.sidebarLink} href="#utilisateurs">
          <i className="fas fa-user-cog" /> Utilisateurs
        </a>
        <a className={styles.sidebarLink} href="#parametres">
          <i className="fas fa-cogs" /> Paramètres
        </a>
      </aside>

      <div className={styles.main}>
        <header className={styles.header}>
          <h1>Bamatech - Tableau de Bord Administrateur</h1>
          <p>Gestion du site web Bamatech</p>
        </header>

        <section id="dashboard">
          <h2 className={styles.sectionTitle}>Statistiques clés</h2>
          <div className={styles.statsGrid}>
            {stats.map((stat) => (
              <div className={styles.statCard} key={stat.label}>
                <i className={`fas ${stat.icon}`} aria-hidden="true" style={{ fontSize: "2rem" }} />
                <h3>{stat.label}</h3>
                <p style={{ fontSize: "1.5rem", fontWeight: 700 }}>{stat.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="actualites">
          <h2 className={styles.sectionTitle}>Actualités</h2>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Date</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.news.map((item) => (
                  <tr key={item.id}>
                    <td>{item.title}</td>
                    <td>{new Date(item.date).toLocaleDateString("fr-FR")}</td>
                    <td>Publié</td>
                    <td className={styles.actions}>
                      <button className={styles.actionButton} type="button">
                        <i className="fas fa-pencil-alt" /> Modifier
                      </button>
                      <button className={styles.actionButton} type="button">
                        <i className="fas fa-trash" /> Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="acteurs">
          <h2 className={styles.sectionTitle}>Acteurs</h2>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Rôle</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.actors.map((actor) => (
                  <tr key={actor.id}>
                    <td>{actor.name}</td>
                    <td>{actor.tags?.join(", ")}</td>
                    <td className={styles.actions}>
                      <button className={styles.actionButton} type="button">
                        <i className="fas fa-pencil-alt" /> Modifier
                      </button>
                      <button className={styles.actionButton} type="button">
                        <i className="fas fa-trash" /> Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="formations">
          <h2 className={styles.sectionTitle}>Formations</h2>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Formation</th>
                  <th>Date</th>
                  <th>Mode</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.trainings.map((training) => (
                  <tr key={training.id}>
                    <td>{training.title}</td>
                    <td>{new Date(training.startDate).toLocaleDateString("fr-FR")}</td>
                    <td>{training.mode}</td>
                    <td className={styles.actions}>
                      <button className={styles.actionButton} type="button">
                        <i className="fas fa-pencil-alt" /> Modifier
                      </button>
                      <button className={styles.actionButton} type="button">
                        <i className="fas fa-trash" /> Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="ressources">
          <h2 className={styles.sectionTitle}>Ressources</h2>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.resources.map((resource) => (
                  <tr key={resource.id}>
                    <td>{resource.title}</td>
                    <td>{resource.type}</td>
                    <td className={styles.actions}>
                      <button className={styles.actionButton} type="button">
                        <i className="fas fa-pencil-alt" /> Modifier
                      </button>
                      <button className={styles.actionButton} type="button">
                        <i className="fas fa-trash" /> Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="messages">
          <h2 className={styles.sectionTitle}>Messages</h2>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Objet</th>
                  <th>Statut</th>
                  <th>Réception</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.messages.map((message) => (
                  <tr key={message.id}>
                    <td>{message.name}</td>
                    <td>{message.email}</td>
                    <td>{message.subject}</td>
                    <td>{message.status}</td>
                    <td>{new Date(message.receivedAt).toLocaleDateString("fr-FR")}</td>
                    <td className={styles.actions}>
                      <button className={styles.actionButton} type="button">
                        <i className="fas fa-envelope-open" /> Lire
                      </button>
                      <button className={styles.actionButton} type="button">
                        <i className="fas fa-trash" /> Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="utilisateurs">
          <h2 className={styles.sectionTitle}>Utilisateurs</h2>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Rôle</th>
                  <th>Dernière connexion</th>
                </tr>
              </thead>
              <tbody>
                {data.users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.role}</td>
                    <td>{user.lastLogin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="parametres">
          <h2 className={styles.sectionTitle}>Paramètres</h2>
          <p>
            Centralisez la configuration du site Bamatech : gestion des rôles,
            automatisations, sécurité et intégrations.
          </p>
        </section>
      </div>
    </div>
  );
}
