(function () {
    // FOUC防止のため、テーマを最速で適用する
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");
    }
})();

document.addEventListener("DOMContentLoaded", () => {
    // 1. ローディング画面のDOM要素生成
    const loader = document.createElement("div");
    loader.id = "page-loader";
    const spinner = document.createElement("div");
    spinner.className = "loader-spinner";
    loader.appendChild(spinner);
    document.body.prepend(loader);

    // ロード中はスクロールを無効化
    document.documentElement.style.overflow = "hidden";

    // 2. テーマ切り替えスイッチのセットアップ
    const themeToggleCheckbox = document.getElementById("themeToggleCheckbox");
    const themeSwitchText = document.getElementById("themeSwitchText");
    const htmlElement = document.documentElement;

    if (themeToggleCheckbox) {
        // 現在のテーマに合わせてチェックボックスとテキストを初期化
        const currentTheme = htmlElement.getAttribute("data-theme");
        const isDark = currentTheme === "dark";
        themeToggleCheckbox.checked = isDark;
        if (themeSwitchText) themeSwitchText.textContent = isDark ? "Dark Mode" : "Light Mode";

        // チェックボックスの変更イベント
        themeToggleCheckbox.addEventListener("change", (e) => {
            const isNowDark = e.target.checked;
            const newTheme = isNowDark ? "dark" : "light";
            htmlElement.setAttribute("data-theme", newTheme);
            localStorage.setItem("theme", newTheme);
            if (themeSwitchText) themeSwitchText.textContent = isNowDark ? "Dark Mode" : "Light Mode";
        });
    }

    // 3. モバイル用ハンバーガーメニューの開閉ロジック
    const menuToggle = document.querySelector('.menu-toggle');
    const navRight = document.querySelector('.nav-right');
    if (menuToggle && navRight) {
        menuToggle.addEventListener('click', () => {
            const isActive = navRight.classList.toggle('active');
            // アイコンの切り替え
            menuToggle.innerHTML = isActive ? '✕' : '☰';

            // メニューが開いているときはスクロールを禁止、閉じているときは許可
            if (isActive) {
                document.documentElement.style.overflow = 'hidden';
            } else {
                document.documentElement.style.overflow = '';
            }
        });
    }
});

// ページ内の画像等すべての読み込みが完了した後
window.addEventListener("load", () => {
    // 強制的に1秒待機してからローディング画面を消す
    setTimeout(() => {
        const loader = document.getElementById("page-loader");
        if (loader) {
            loader.style.opacity = "0"; // フェードアウト開始
            setTimeout(() => {
                loader.remove(); // DOMから削除
                document.documentElement.style.overflow = ""; // スクロールを再有効化
            }, 500); // CSSのtransition(0.5s)と合わせる
        }
    }, 1000);
});
