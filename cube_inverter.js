(async function() {
        let aboutAction, cubeInverterAction
        const id = "cube_inverter"
        const name = "Cube Inverter"
        const icon = "invert_colors"
        const author = "SirJain"

        // Used for about dialog
        const links = {
                website: "https://google.com/",
                twitter: "https://twitter.com/SirJain2",
                discord: "https://discord.com/"
        }

        // Registers plugin data
        Plugin.register(id, {
                title: name,
                icon,
                author,
                description: "Adds a button that inverts selected cube sizes.",
                about: "To do",
                tags: ["To do"],
                version: "1.0.0",
                min_version: "4.2.0",
                variant: "both",
                oninstall: () => showAbout(true),
                onload() {
                        addAbout()

                        cubeInverterAction = new Action("cube_inverter_action", {
                                name: "Invert Cubes",
                                icon: icon,
                                click: () => invertCubes()
                        })

                        Toolbars.element_size.add(cubeInverterAction)
                },
                onunload() {
                        aboutAction.delete()
                        cubeInverterAction.delete()
                        MenuBar.removeAction(`help.about_plugins.about_${id}`)
                }
        })

        function invertCubes() {
                if (Cube.selected.length === 0) {
                        Blockbench.showMessageBox({
                                title: "No cubes selected!",
                                message: "You need to select cubes to use this action."
                        })
                } else {
                        for (const cube of Cube.selected) {
                                cube.size(0) = -cube.size(0);
                                cube.size(1) = -cube.size(1);
                                cube.size(2) = -cube.size(2);
                        }
                }
        }

        function addAbout() {
                let about = MenuBar.menus.help.structure.find(e => e.id === "about_plugins")
                if (!about) {
                        about = new Action("about_plugins", {
                                name: "About Plugins...",
                                icon: "info",
                                children: []
                        })
                        MenuBar.addAction(about, "help")
                }
                aboutAction = new Action(`about_${id}`, {
                        name: `About ${name}...`,
                        icon,
                        click: () => showAbout()
                })
                about.children.push(aboutAction)
        }

        function showAbout(banner) {
                const infoBox = new Dialog({
                        id: "about",
                        title: name,
                        width: 780,
                        buttons: [],
                        lines: [`
                                <style>
                                        dialog#about .dialog_title {
                                                padding-left: 0;
                                                display: flex;
                                                align-items: center;
                                                gap: 10px;
                                        }
                                        dialog#about .dialog_content {
                                                text-align: left!important;
                                                margin: 0!important;
                                        }
                                        dialog#about .socials {
                                                padding: 0!important;
                                        }
                                        dialog#about #banner {
                                                background-color: var(--color-accent);
                                                color: var(--color-accent_text);
                                                width: 100%;
                                                padding: 0 8px
                                        }
                                        dialog#about #content {
                                                margin: 24px;
                                        }
                                </style>
                                ${banner ? `<div id="banner">This window can be reopened at any time from <strong>Help > About Plugins > ${name}</strong></div>` : ""}
                                <div id="content">
                                        <h1 style="margin-top:-10px">${name}</h1>
                                        <p>placeholder</p>
                                        <div class="socials">
                                                <a href="${links["website"]}" class="open-in-browser">
                                                        <i class="icon material-icons" style="color:#33E38E">language</i>
                                                        <label>By ${author}</label>
                                                </a>
                                                <a href="${links["discord"]}" class="open-in-browser">
                                                        <i class="icon fab fa-discord" style="color:#727FFF"></i>
                                                        <label>Discord Server</label>
                                                </a>
                                        </div>
                                </div>
                        `]
                }).show()
                $("dialog#about .dialog_title").html(`
                        <i class="icon material-icons">${icon}</i>
                        ${name}
                `)
        }
})()