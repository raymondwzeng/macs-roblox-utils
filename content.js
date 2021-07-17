chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
    //   console.log(sender.tab ?
    //               "from a content script:" + sender.tab.url :
    //               "from the extension");
      if(request.message === "PluginInfo")
      {
          if(document.getElementById("safety-score") != undefined) return;
        let data = request.payload;
        let reasonArray = [];
        let pluginSafetyScore = 100;
        if(data["CreatorType"] == "Group" && data["CreatorName"].startsWith('@'))
        {
            pluginSafetyScore -= 30;
            reasonArray.push("Potential impersonation: Group begins with '@'");
        }
        const createdDate = new Date(data["Created"]);
        if(Math.floor(Date.now() - createdDate)/86400193.536 < 30)
        {
            pluginSafetyScore -= 25;
            reasonArray.push("Plugin was created less than 30 days ago.");
        }
        const accountCreationDate = new Date(data["AccountAge"]);
        if(Math.floor(Date.now() - accountCreationDate)/86400193.536 < 30)
        {
            pluginSafetyScore -= 30;
            reasonArray.push("User account age is under 30 days.");
        }
        const itemDetailsTop = document.getElementById("item-details");
        let safetyScoreWidget = document.createElement("div");
        safetyScoreWidget.classList.add("clearfix");
        safetyScoreWidget.classList.add("item-field-container");
        safetyScoreWidget.id = "safety-score";
        safetyScoreWidget.style.marginBottom = "0.5em";
        let safetyScoreTitle = document.createElement("div");
        safetyScoreTitle.classList.add("font-header-1");
        safetyScoreTitle.classList.add("text-subheader");
        safetyScoreTitle.classList.add("text-label");
        safetyScoreTitle.classList.add("text-overflow");
        safetyScoreTitle.classList.add("field-label");
        safetyScoreTitle.innerText = "Safety Score ";
        safetyScoreWidget.appendChild(safetyScoreTitle);
        let safetyScore = document.createElement("span");
        safetyScore.classList.add("field-content");
        if(pluginSafetyScore >= 80)
        {
            safetyScore.style.color = "#09C200";
        } else if (pluginSafetyScore >= 60)
        {
            safetyScore.style.color = "#F7E100";
        } else
        {
            safetyScore.style.color = "#BE0409";
        }
        safetyScore.style.fontWeight = "bolder";
        safetyScore.innerText = pluginSafetyScore;
        safetyScoreWidget.appendChild(safetyScore);
        let safetyScoreExplanation = document.createElement("p");
        safetyScoreExplanation.classList.add("field-content");
        safetyScoreExplanation.classList.add("font-body");
        safetyScoreExplanation.classList.add("description-content");
        safetyScoreExplanation.classList.add("content-height");
        safetyScoreExplanation.style.whiteSpace = "pre-line";
        reasonArray.forEach((reason) =>
        {
            safetyScoreExplanation.textContent += "- " + reason + "\r\n";
        })
        safetyScoreExplanation.style.float = "right";
        safetyScoreWidget.appendChild(safetyScoreExplanation);
        itemDetailsTop.insertBefore(safetyScoreWidget, itemDetailsTop.childNodes[2]);
      }
    }
  );
