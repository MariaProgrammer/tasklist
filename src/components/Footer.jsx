const publicBase = import.meta.env.BASE_URL;

function getPublicAssetPath(filename) {
  return `${publicBase}${filename}`;
}

export default function Footer() {
  return (
    <footer className="dashboard-footer">
      <p>
        Используется React, Vite, Node.js, Express,
        PostgreSQL, JWT и Docker.
      </p>

      <div className="dashboard-footer__links">
        <a
          href="https://t.me/Divomaster_spb"
          target="_blank"
          rel="noreferrer"
          aria-label="Написать в Telegram"
        >
          <img
            className="footer-img"
            src={getPublicAssetPath("telegram.png")}
            alt=""
          />
        </a>

        <a
          href="https://vk.me/id1111401282"
          target="_blank"
          rel="noreferrer"
          aria-label="Написать во ВКонтакте"
        >
          <img
            className="footer-img"
            src={getPublicAssetPath("vk.png")}
            alt=""
          />
        </a>

        <a
          href="mailto:divomaster.spb@gmail.com"
          aria-label="Написать по электронной почте"
        >
          <img
            className="footer-img"
            src={getPublicAssetPath("email.png")}
            alt=""
          />
        </a>
      </div>
    </footer>
  );
}