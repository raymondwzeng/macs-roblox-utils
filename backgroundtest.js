const assetIdFromURL = /\d{1,20}/g;
let regURL = new RegExp(assetIdFromURL);

async function getUserIdFromGroup(TargetId) {
    return fetch(`https://groups.roblox.com/v2/groups?groupIds=${TargetId}`)
                .then(response => response.json())
                .then(response => response.data[0]["owner"]["id"]);
}

chrome.storage.sync.onChanged.addListener((changed) =>
{
    if(changed["PluginSafety"]["newValue"] === true)
    {
        chrome.webNavigation.onCompleted.addListener(handlePluginSafetyCheck, {url: [{urlContains: "roblox.com/library"}]});
    } else
    {
        chrome.webNavigation.onCompleted.removeListener(handlePluginSafetyCheck);
    }
})

function handlePluginSafetyCheck(details) {
    const url = `https://api.roblox.com/marketplace/productinfo?assetId=${details.url.match(regURL)[0]}`
        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log("Verbose output data: ");
                console.log(data);
                if(data["AssetTypeId"] !== 38) return;
                chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                    if(tabs.length === 0) {
                        console.log("No active tab found."); 
                        return;
                    }
                    var AccountId;
                    if(data["Creator"]["CreatorType"] == "Group")
                    {
                        getUserIdFromGroup(data["Creator"]["CreatorTargetId"]).then((AccountId) => {
                            fetch(`https://users.roblox.com/v1/users/`+AccountId)
                                .then(response => response.json())
                                .then(userData => {
                                    chrome.tabs.sendMessage(tabs[0].id, {
                                        message: "PluginInfo",
                                        payload: {
                                            CreatorType: data["Creator"]["CreatorType"],
                                            CreatorName: data["Creator"]["Name"],
                                            Created: data["Created"],
                                            AccountAge: userData["created"]
                                        }
                                    });
                                })
                        });
                    } else 
                    {
                        AccountId = data["Creator"]["CreatorTargetId"];
                        fetch(`https://users.roblox.com/v1/users/${AccountId}`)
                        .then(response => response.json())
                        .then(userData => {
                            chrome.tabs.sendMessage(tabs[0].id, {
                                message: "PluginInfo",
                                payload: {
                                    CreatorType: data["Creator"]["CreatorType"],
                                    CreatorName: data["Creator"]["Name"],
                                    Created: data["Created"],
                                    AccountAge: userData["created"]
                                }
                            });
                        });
                    }
                });
            });
    
}


