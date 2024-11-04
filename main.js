document.addEventListener("DOMContentLoaded", async () => {
    const table = /** @type {HTMLTableElement} */ (document.querySelector("table"));
    const runtimeSelect = /** @type {HTMLSelectElement} */ (document.querySelector("select"));
    const preReleases = /** @type {HTMLInputElement} */ (document.querySelector("#pre-releases"));

    const data = await fetch(
        "https://raw.githubusercontent.com/nodejs/node/refs/heads/main/doc/abi_version_registry.json"
    ).then((res) => res.json());
    const nodeModuleVersions = data.NODE_MODULE_VERSION;

    const runtimes = [...new Set(nodeModuleVersions.map((item) => item.runtime))];
    runtimes.forEach((runtime) => {
        const option = document.createElement("option");
        option.value = runtime;
        option.textContent = runtime;
        runtimeSelect.appendChild(option);
    });

    function populateTable() {
        while (table.rows.length > 1) table.deleteRow(1);

        nodeModuleVersions
            .filter(
                (nmv) =>
                    (runtimeSelect.value === "all" || nmv.runtime == runtimeSelect.value) &&
                    (preReleases.checked || !nmv.versions.includes("pre"))
            )
            .forEach((item) => {
                const row = table.insertRow();

                const cellModules = row.insertCell();
                cellModules.textContent = item.modules;

                const cellRuntime = row.insertCell();
                cellRuntime.textContent = item.runtime;

                const cellVersions = row.insertCell();
                cellVersions.textContent = item.versions;
            });
    }

    populateTable();

    runtimeSelect.addEventListener("change", () => populateTable());
    preReleases.addEventListener("change", () => populateTable());
});
