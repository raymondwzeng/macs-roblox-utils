function load()
{
    let PluginSafety = document.getElementById("PluginSafety");
    chrome.storage.sync.get("PluginSafety", function(data)
    {
        PluginSafety.checked = data["PluginSafety"];
    });
    PluginSafety.addEventListener("click", function() {
        console.log(this.checked);
        chrome.storage.sync.set({
            PluginSafety: this.checked
        });
    });
}

window.addEventListener('DOMContentLoaded', (event)=>{
    load();
});