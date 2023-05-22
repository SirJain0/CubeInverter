/*
To do:
- Fix UVs of inverted cubes
- Fix some incomplete plugin meta fields
- Finalize icon
- Add keybinding to action
*/

(async function() {
        let aboutAction, cubeInverterAction
        const id = "cube_inverter"
        const name = "Cube Inverter"
        const icon = "invert_colors"
        const author = "SirJain"

        // Used for about dialog
        const links = {
                website: "https://sirjain0.github.io/",
                twitter: "https://twitter.com/SirJain2",
                discord: "https://discord.gg/wM4CKTbFVN"
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
                                description: "Invert the values of all axes of selected cubes.",
                                keybind: new Keybind({key: 'i', shift: true}),
                                condition: () => Cube.selected.length,
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
                Undo.initEdit({elements: Cube.selected, outliner: true});

                for (const cube of Cube.selected) {
                        [cube.from, cube.to] = [cube.to, cube.from]
                }

                Canvas.updateAll()
                Undo.finishEdit('Inverted cube values', {elements: Cube.selected, outliner: true});
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
                                        <p>Adds a button that inverts selected cube sizes.</p>
                                        <h4>Worth noting:</h4>
                                        <p>- The plugin inverts each value of all the cubes selected - Positive to Negative or Negative to Positive.</p>
                                        <p>- This plugin logically works on cubes - no meshes or other outliner elements.</p>
                                        <p>- Like all other keybindings, the keybind tied to the 'Invert Cube' action can be changed in the settings.</p>
                                        <h4>How to use:</h4>
                                        <p>To use this plugin, press the <b>Invert Cubes</b> button which is located next to the Inflation number in the edit tab.</p>
                                        <br>
                                        <div class="socials">
                                                <a href="${links["website"]}" class="open-in-browser">
                                                        <i class="icon material-icons" style="color:#33E38E">language</i>
                                                        <label>Website</label>
                                                </a>
                                                <a href="${links["discord"]}" class="open-in-browser">
                                                        <i class="icon fab fa-discord" style="color:#727FFF"></i>
                                                        <label>Discord Server</label>
                                                </a>
                                                <a href="${links["twitter"]}" class="open-in-browser">
                                                        <i class="fa-brands fa-twitter" style="color:#1DA1F2"></i>
                                                        <label>Twitter</label>
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