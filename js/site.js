document.addEventListener("DOMContentLoaded", () => {

    const marqueeConfigs = [

        {
            container:
                ".announcement-bar",

            track:
                ".announcement-bar__track",

            group:
                ".announcement-bar__group",

            widthVariable:
                "--announcement-width"
        },

        {
            container:
                ".brand-statement__marquee",

            track:
                ".brand-statement__track",

            group:
                ".brand-statement__group",

            widthVariable:
                "--brand-statement-width"
        }

    ];


    marqueeConfigs.forEach((config) => {

        document
            .querySelectorAll(config.container)
            .forEach((container) => {

                const track =
                    container.querySelector(
                        config.track
                    );

                const originalGroup =
                    container.querySelector(
                        config.group
                    );


                if (!track || !originalGroup) {
                    return;
                }


                function buildMarquee() {

                    track
                        .querySelectorAll(
                            `${config.group}[data-clone]`
                        )
                        .forEach(
                            (clone) => clone.remove()
                        );


                    const groupWidth =
                        originalGroup
                            .getBoundingClientRect()
                            .width;


                    if (!groupWidth) {
                        return;
                    }


                    track.style.setProperty(
                        config.widthVariable,
                        `${groupWidth}px`
                    );


                    const copiesNeeded =
                        Math.ceil(
                            (window.innerWidth * 2) /
                            groupWidth
                        ) + 1;


                    for (
                        let i = 1;
                        i < copiesNeeded;
                        i++
                    ) {

                        const clone =
                            originalGroup.cloneNode(true);


                        clone.dataset.clone =
                            "true";


                        clone.setAttribute(
                            "aria-hidden",
                            "true"
                        );


                        track.appendChild(clone);

                    }

                }


                buildMarquee();


                let resizeTimer;


                window.addEventListener(
                    "resize",
                    () => {

                        clearTimeout(
                            resizeTimer
                        );


                        resizeTimer =
                            setTimeout(
                                buildMarquee,
                                150
                            );

                    }
                );

            });

    });

});

document.addEventListener("DOMContentLoaded", () => {

    const menuToggle =
        document.querySelector(".menu-toggle");

    const mobileMenu =
        document.querySelector(".mobile-menu");

    const siteTop =
    document.querySelector(".site-top");

    function updateMenuPosition() {

    if (!siteTop) {
        return;
    }


    const siteTopBottom =
        siteTop
            .getBoundingClientRect()
            .bottom;


    document.documentElement.style.setProperty(
        "--mobile-menu-top",
        `${Math.round(siteTopBottom)}px`
    );

}

updateMenuPosition();


    if (!menuToggle || !mobileMenu) {
        return;
    }

    function normalizePath(path) {

        const withoutIndex =
            path.replace(
                /\/index\.html$/,
                "/"
            );

        const withoutTrailingSlash =
            withoutIndex.replace(
                /\/+$/,
                ""
            );

        return withoutTrailingSlash || "/";

    }


    const currentPath =
        normalizePath(
            window.location.pathname
        );


    mobileMenu
        .querySelectorAll("nav a")
        .forEach((link) => {

            const linkPath =
                normalizePath(
                    new URL(
                        link.href,
                        window.location.href
                    ).pathname
                );


            if (linkPath === currentPath) {

                link.setAttribute(
                    "aria-current",
                    "page"
                );

            }

        });


    /*
     * Create the dark backdrop automatically.
     */

    const backdrop =
        document.createElement("div");

    backdrop.className =
        "mobile-menu-backdrop";

    document.body.appendChild(backdrop);


    function openMenu() {

    updateMenuPosition();

    const scrollY =
        window.scrollY;


    document.body.dataset.menuScrollY =
        scrollY;


    mobileMenu.classList.add(
        "is-open"
    );

    menuToggle.classList.add(
        "is-open"
    );

    backdrop.classList.add(
        "is-open"
    );


    menuToggle.setAttribute(
        "aria-expanded",
        "true"
    );

    mobileMenu.setAttribute(
        "aria-hidden",
        "false"
    );


    /*
     * Fully freeze the page behind
     * the mobile menu.
     */

    document.body.style.position =
        "fixed";

    document.body.style.top =
        `-${scrollY}px`;

    document.body.style.left =
        "0";

    document.body.style.right =
        "0";

    document.body.style.width =
        "100%";

}


    function closeMenu() {

    const scrollY =
        parseInt(
            document.body.dataset.menuScrollY || "0",
            10
        );


    mobileMenu.classList.remove(
        "is-open"
    );

    menuToggle.classList.remove(
        "is-open"
    );

    backdrop.classList.remove(
        "is-open"
    );


    menuToggle.setAttribute(
        "aria-expanded",
        "false"
    );

    mobileMenu.setAttribute(
        "aria-hidden",
        "true"
    );


    /*
     * Unlock the page.
     */

    document.body.style.position =
        "";

    document.body.style.top =
        "";

    document.body.style.left =
        "";

    document.body.style.right =
        "";

    document.body.style.width =
        "";


    window.scrollTo(
        0,
        scrollY
    );

}


    menuToggle.addEventListener(
        "click",
        () => {

            const isOpen =
                mobileMenu.classList.contains(
                    "is-open"
                );


            if (isOpen) {
                closeMenu();
            }

            else {
                openMenu();
            }

        }
    );


    backdrop.addEventListener(
        "click",
        closeMenu
    );


    mobileMenu
        .querySelectorAll("a")
        .forEach((link) => {

            link.addEventListener(
                "click",
                closeMenu
            );

        });


    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape" &&
                mobileMenu.classList.contains(
                    "is-open"
                )
            ) {

                closeMenu();

            }

        }
    );


    window.addEventListener(
    "resize",
    () => {

        updateMenuPosition();

        if (
            window.innerWidth > 900 &&
            mobileMenu.classList.contains(
                "is-open"
            )
        ) {

            closeMenu();

        }

    }
    );

});

document.addEventListener("DOMContentLoaded", () => {

    const carousel =
        document.querySelector(
            ".featured-carousel"
        );

    const track =
        carousel?.querySelector(
            ".product-grid"
        );

    const prevButton =
        document.querySelector(
            ".featured-carousel__button--prev"
        );

    const nextButton =
        document.querySelector(
            ".featured-carousel__button--next"
        );


    if (
        !carousel ||
        !track ||
        !prevButton ||
        !nextButton
    ) {
        return;
    }


    const cards =
        Array.from(
            track.querySelectorAll(
                ".product-card"
            )
        );


    let currentIndex = 0;


    function getVisibleCount() {

        if (window.innerWidth <= 900) {
            return cards.length;
        }

        return 4;

    }


    function updateCarousel() {

        if (window.innerWidth <= 900) {

            currentIndex = 0;

            track.style.transform =
                "translateX(0)";

            return;

        }


        const firstCard =
            cards[0];


        if (!firstCard) {
            return;
        }


        const trackStyles =
            window.getComputedStyle(track);


        const gap =
            parseFloat(
                trackStyles.columnGap
            ) || 0;


        const cardWidth =
            firstCard
                .getBoundingClientRect()
                .width;


        const distance =
            currentIndex *
            (cardWidth + gap);


        track.style.transform =
            `translateX(-${distance}px)`;

    }


    nextButton.addEventListener(
        "click",
        () => {

            const visibleCount =
                getVisibleCount();

            const maxIndex =
                Math.max(
                    0,
                    cards.length -
                    visibleCount
                );


            if (currentIndex >= maxIndex) {

                currentIndex = 0;

            }

            else {

                currentIndex += 1;

            }


            updateCarousel();

        }
    );


    prevButton.addEventListener(
        "click",
        () => {

            const visibleCount =
                getVisibleCount();

            const maxIndex =
                Math.max(
                    0,
                    cards.length -
                    visibleCount
                );


            if (currentIndex <= 0) {

                currentIndex =
                    maxIndex;

            }

            else {

                currentIndex -= 1;

            }


            updateCarousel();

        }
    );


    window.addEventListener(
        "resize",
        updateCarousel
    );


    updateCarousel();

});