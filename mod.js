window.onbeforeunload = function() {
    return true;
}

mod = {
    objectives: [],
    settings: {}
}

repository_data = {}
sendRequest()

async function sendRequest() {
    console.log("Loading REPO")
    response = await fetch("repo.txt")
    repository_data_p = await response.text()
    repository_data = JSON.parse(repository_data_p)
    console.log("Loaded REPO")
}

refreshMods = function () {
    document.getElementById("cards").innerHTML = ''
    index = 0
    for (objective of mod.objectives) {
        if (objective.type == "kill") {
            document.getElementById("cards").innerHTML += `<div class="card">
                <div class="card-content">
                    <div class="media">
                        <div class="media-content">
                            <div class="title is-4">
                                <p>Kill ${objective.targetName}</p>
                            </div>
                            <div class="subtitle is-6">
                                <p>Simple objective</p>
                            </div>
                        </div>
                    </div>
                    <a class="button is-link" onclick="moveObjective(${index})">Move Objective</a>
                    <a class="button is-danger" onclick="deleteObjective(${index})">Delete Objective</a>
                </div>
            </div>`
        }
        if (objective.type == "complex") {
            document.getElementById("cards").innerHTML += `<div class="card">
                <div class="card-content">
                    <div class="media">
                        <div class="media-content">
                            <div class="title is-4">
                                <p>${objective.eventName}</p>
                            </div>
                            <div class="subtitle is-6">
                                <p>State machine</p>
                            </div>
                        </div>
                    </div>
                    <a class="button is-link" onclick="moveObjective(${index})">Move Objective</a>
                    <a class="button is-danger" onclick="deleteObjective(${index})">Delete Objective</a>
                </div>
            </div>`
        }
        if (objective.type == "complexTargeted") {
            document.getElementById("cards").innerHTML += `<div class="card">
                <div class="card-content">
                    <div class="media">
                        <div class="media-content">
                            <div class="title is-4">
                                <p>${objective.eventName}, ${objective.targetName}</p>
                            </div>
                            <div class="subtitle is-6">
                                <p>State machine</p>
                            </div>
                        </div>
                    </div>
                    <a class="button is-link" onclick="moveObjective(${index})">Move Objective</a>
                    <a class="button is-danger" onclick="deleteObjective(${index})">Delete Objective</a>
                </div>
            </div>`
        }
        index += 1
    }
}

newSimpleObjective = function(target, activation, activationCustom, exitNode) {
    if (activation == "Always active") {
        activation = "ACTIVE"
    } else if (activation == "Previous objective") {
        activation = "PREVIOUS"
    } else {
        activation = activationCustom
    }
    id = target
    for (item of repository_data) {
        try {
            item["Name"]
        }
        catch {
            continue
        }
        if (item["Name"] == target) {
            id = item["ID_"]
        }
    }
    mod.objectives.push({
        type: "kill",
        targetName: target,
        targetID: id,
        activation: activation,
        exitNode: exitNode
    })
    document.getElementById("newObjective").style = "display: none"
    document.getElementById("killObjective").style = "display: none"
    document.getElementById("eventObjective").style = "display: none"
    refreshMods()
}

onTypeChange = function() {
    onEventChange()
    var type = document.getElementById("objectiveType").value
    if (type == "Kill") {
        document.getElementById("killObjective").style = "display: block"
        document.getElementById("eventObjective").style = "display: none"
    } else if (type == "Event-based") {
        document.getElementById("killObjective").style = "display: none"
        document.getElementById("eventObjective").style = "display: block"
    }
}

onEventChange = function() {
    document.getElementById("objectiveTargetWantedValue").checked = false
    onTargetingChange()
    var events_notarget = ["Alert status changed", "All pacified bodies hidden", "Body found (accident)", "Body found (non-accident)", "Body hidden", "Camera evidence deleted", "Dead body seen", "Disguise blown", "Evidence hidden", "First missed shot", "First non-headshot", "Game put on high alert", "Guard confiscated weapon", "Guard found item", "Haven Island pamphlet collected", "Murdered body seen", "Player arrested", "Player caught armed", "Player caught in combat", "Player changed disguise", "Player climbed drainpipe", "Player died", "Player frisked successfully", "Player held an illegal weapon", "Player hid in closet/box", "Player in combat (GameTension)", "Player in combat (HM_InCombat)", "Player infected (Patient Zero)", "Player no longer being hunted (NoHunting)", "Player pacified NPC noticed", "Player pacified NPC unnoticed", "Player performed an agility action", "Player recorded by camera", "Player removed item from inventory", "Player stashed item", "Player threw item", "Player spotted", "Player wounded", "Situation contained", "Unnoticed kill", "Witnesses saw player", "NPC investigated distraction"]
    var events_targetable = ["Door unlocked", "NPC emetic poisoned", "Player trespassed"]
    var events_targetrequired = ["Player pacified NPC", "Player killed NPC"]
    
    var event = document.getElementById("objectiveEvent").value
    if (events_notarget.includes(event)) {
        document.getElementById("objectiveTargetWanted").style = "display: none"
        document.getElementById("objectiveTargetStyling").style = "display: none"
    } else if (events_targetable.includes(event)) {
        document.getElementById("objectiveTargetWanted").style = "display: block"
        document.getElementById("objectiveTargetStyling").style = "display: none"
    } else if (events_targetrequired.includes(event)) {
        document.getElementById("objectiveTargetWanted").style = "display: none"
        document.getElementById("objectiveTargetStyling").style = "display: block"
    }
}

onTargetingChange = function() {
    if (document.getElementById("objectiveTargetWantedValue").checked) {
        document.getElementById("objectiveTargetStyling").style = "display: block"
    } else {
        document.getElementById("objectiveTargetStyling").style = "display: none"
    }
}

onTimerChange = function() {
    if (document.getElementById("settingEnableTimer").checked) {
        document.getElementById("settingTimerStyling").style = "display: block"
    } else {
        document.getElementById("settingTimerStyling").style = "display: none"
    }
}

onReplacesChange = function() {
    arrival_incompat = ["CYOA Sapienza"]
    gt_incompat = ["Sniper Assassin: Hawke-aido"]
    ft_incompat = ["Target Practice"]
    if (document.getElementById("settingReplaces").value == "Arrival") {
        document.getElementById("compatiblilityText").innerText = "Your mod will be incompatible with: " + arrival_incompat.join(", ")
    } else if (document.getElementById("settingReplaces").value == "Guided Training") {
        document.getElementById("compatiblilityText").innerText = "Your mod will be incompatible with: " + gt_incompat.join(", ")
    } else if (document.getElementById("settingReplaces").value == "Freeform Training") {
        document.getElementById("compatiblilityText").innerText = "Your mod will be incompatible with: " + ft_incompat.join(", ")
    }
}

onActivationChange = function() {
    if (document.getElementById("objectiveActivation").value == "Custom index") {
        document.getElementById("customActivationStyling").style = "display: block"
    } else {
        document.getElementById("customActivationStyling").style = "display: none"
    }
}

onActivation2Change = function() {
    if (document.getElementById("objectiveActivation2").value == "Custom index") {
        document.getElementById("customActivation2Styling").style = "display: block"
    } else {
        document.getElementById("customActivation2Styling").style = "display: none"
    }
}

newComplexObjective = function(event, target, activation, briefing, activationCustom, exitNode) {
    if (activation == "Always active") {
        activation = "ACTIVE"
    } else if (activation == "Previous objective") {
        activation = "PREVIOUS"
    } else {
        activation = activationCustom
    }
    var eventMap = {
        "Alert status changed": "AmbientChange",
        "All pacified bodies hidden": "AllPacifiedHidden",
        "Body found (accident)": "AccidentBodyFound",
        "Body found (non-accident)": "BodyFound",
        "Body hidden": "HideBody",
        "Camera evidence deleted": "Surveilance_EvidenceDeleted",
        "Dead body seen": "DeadBodySeen",
        "Disguise blown": "DisguiseBlown",
        "Evidence hidden": "EvidenceHidden",
        "First missed shot": "FirstMissedShot",
        "First non-headshot": "FirstNonHeadshot",
        "Game put on high alert": "GameTension_HighAlert",
        "Guard confiscated weapon": "Guard_ItemStashed",
        "Guard found item": "Guard_FoundItem",
        "Haven Island pamphlet collected": "PhampletCollected",
        "Murdered body seen": "MurderedBodySeen",
        "Player arrested": "GameTension_Arrest",
        "Player caught armed": "CaughtArmed",
        "Player caught in combat": "CaughtInCombat",
        "Player changed disguise": "DisguiseChange",
        "Player climbed drainpipe": "DrainPipe_climbed",
        "Player died": "Died",
        "Player frisked successfully": "FriskedSuccess",
        "Player held an illegal weapon": "HoldingIllegalWeapon",
        "Player hid in closet/box": "Hidden",
        "Player in combat (GameTension)": "GameTension_Combat",
        "Player in combat (HM_InCombat)": "HM_InCombat",
        "Player infected (Patient Zero)": "47_Infected",
        "Player no longer being hunted (NoHunting)": "NoHunting",
        "Player pacified NPC noticed": "Noticed_Pacified",
        "Player pacified NPC unnoticed": "Unnoticed_Pacified",
        "Player performed an agility action": "Agility_Start",
        "Player recorded by camera": "Surveilance_HMRecorded",
        "Player removed item from inventory": "ItemRemovedFromInventory",
        "Player stashed item": "ItemStashed",
        "Player threw item": "ItemThrown",
        "Player spotted": "Spotted",
        "Player wounded": "Hero_Health",
        "Situation contained": "SituationContained",
        "Unnoticed kill": "Unnoticed_Kill",
        "Witnesses saw player": "Witnesses",
        "NPC investigated distraction": "Investigate_Curious",
        "Door unlocked": "DoorUnlocked",
        "NPC emetic poisoned": "Actorsick",
        "Player trespassed": "Trespassing",
        "Player pacified NPC": "Pacify",
        "Player killed NPC": "Kill",
    }
    var event_id = eventMap[event]
    if (target == "NO_TARGET") {
        mod.objectives.push({
            type: "complex",
            eventName: event,
            event: event_id,
            activation: activation,
            briefing: briefing,
            exitNode: exitNode
        })
        document.getElementById("newObjective").style = "display: none"
        document.getElementById("killObjective").style = "display: none"
        document.getElementById("eventObjective").style = "display: none"
        document.getElementById("objectiveTargetWanted").style = "display: none"
        document.getElementById("objectiveTargetStyling").style = "display: none"
        refreshMods()
    } else {
        id = target
        for (item of repository_data) {
            try {
                item["Name"]
            }
            catch {
                continue
            }
            if (item["Name"] == target) {
                id = item["ID_"]
            }
        }
        mod.objectives.push({
            type: "complexTargeted",
            eventName: event,
            event: event_id,
            targetName: target,
            targetID: id,
            activation: activation,
            briefing: briefing,
            exitNode: exitNode
        })
        document.getElementById("newObjective").style = "display: none"
        document.getElementById("killObjective").style = "display: none"
        document.getElementById("eventObjective").style = "display: none"
        document.getElementById("objectiveTargetWanted").style = "display: none"
        document.getElementById("objectiveTargetStyling").style = "display: none"
        refreshMods()
    }
}

addComplexObjective = function() {
    var target = document.getElementById("objectiveTargetWantedValue").checked ? document.getElementById('objectiveTarget2').value : "NO_TARGET"
    var events_targetrequired = ["Player pacified NPC", "Player killed NPC"]
    if (events_targetrequired.includes(document.getElementById("objectiveEvent").value)) {target = document.getElementById('objectiveTarget2').value}
    newComplexObjective(document.getElementById('objectiveEvent').value, target, document.getElementById('objectiveActivation2').value, document.getElementById('objectiveBriefing').value, document.getElementById("objectiveActivation2Custom").value, document.getElementById("objectiveExitNode2").checked)
}

addObjective = function() {
    document.getElementById("objectiveTargetWantedValue").checked = false
    document.getElementById("objectiveExitNode").checked = false
    document.getElementById("objectiveExitNode2").checked = false
    document.getElementById("objectiveTarget").value = ""
    document.getElementById("objectiveTarget2").value = ""
    document.getElementById("objectiveBriefing").value = ""
    document.getElementById("dispatchTypeChange").dispatchEvent(new Event("input"))
    document.getElementById("objectiveEvent").dispatchEvent(new Event("input"))
    document.getElementById("objectiveTargetWantedValue").dispatchEvent(new Event("input"))
    document.getElementById("objectiveActivation").dispatchEvent(new Event("input"))
    document.getElementById("objectiveActivation2").dispatchEvent(new Event("input"))
    if (document.getElementById("newObjective").style.display == "none") {
        document.getElementById("newObjective").style = "display: block"
    } else {
        document.getElementById("newObjective").style = "display: none"
    }
}

deleteObjective = function(index) {
    mod.objectives.splice(index, 1)
    refreshMods()
}

moveObjective = function(index) {
    var removed = mod.objectives.splice(index, 1)
    mod.objectives.splice(parseInt(prompt("Which position should the objective be moved to?")) - 1, 0, removed[0])
    refreshMods()
}

missionConfig = function() {
    if (document.getElementById("missionConfigStyling").style.display == "none") {
        document.getElementById("missionConfigStyling").style = "display: block"
    } else {
        document.getElementById("missionConfigStyling").style = "display: none"
    }
}

saveMissionConfig = function() {
    mod.settings.EnableSaving = document.getElementById("settingEnableSaving").checked
    mod.settings.title = document.getElementById("settingTitle").value
    mod.settings.description = document.getElementById("settingDescription").value
    var locationMap = {
        "ICA Facility (cruise ship)": "LOCATION_ICA_FACILITY_SHIP|assembly:/_PRO/Scenes/Missions/TheFacility/_Scene_Mission_Polarbear_Module_002.entity",
        "Paris": "LOCATION_PARIS|assembly:/_PRO/Scenes/Missions/Paris/_Scene_FashionShowHit_01.entity",
        "Sapienza": "LOCATION_COASTALTOWN|assembly:/_PRO/Scenes/Missions/CoastalTown/Mission01.entity",
        "Marrakesh": "LOCATION_MARRAKECH|assembly:/_PRO/Scenes/Missions/Marrakesh/_Scene_Mission_Spider.entity",
        "Bangkok": "LOCATION_BANGKOK|assembly:/_PRO/Scenes/Missions/Bangkok/_Scene_Mission_Tiger.entity",
        "Colorado": "LOCATION_COLORADO|assembly:/_PRO/Scenes/Missions/Colorado_2/_scene_mission_bull.entity",
        "Hokkaido": "LOCATION_HOKKAIDO|assembly:/_PRO/Scenes/Missions/Hokkaido/_Scene_Mission_SnowCrane.entity",
        "Hawke's Bay": "LOCATION_NEWZEALAND|assembly:/_pro/scenes/missions/sheep/scene_sheep.entity",
        "Miami": "LOCATION_MIAMI|assembly:/_pro/scenes/missions/miami/scene_flamingo.entity",
        "Santa Fortuna": "LOCATION_COLOMBIA|assembly:/_pro/scenes/missions/colombia/scene_hippo.entity",
        "Mumbai": "LOCATION_MUMBAI|assembly:/_pro/scenes/missions/Mumbai/scene_mongoose.entity",
        "Whittleton Creek": "LOCATION_NORTHAMERICA|assembly:/_pro/scenes/missions/skunk/scene_skunk.entity",
        "Isle of Sgail": "LOCATION_NORTHSEA|assembly:/_pro/scenes/missions/theark/scene_magpie.entity",
        "New York": "LOCATION_GREEDY_RACCOON|assembly:/_pro/scenes/missions/Greedy/mission_raccoon/scene_raccoon_basic.entity",
        "Haven Island": "LOCATION_OPULENT_STINGRAY|assembly:/_pro/scenes/missions/opulent/mission_stingray/scene_stingray_basic.entity"
    }
    mod.settings.location = locationMap[document.getElementById("settingLocation").value]
    var replaceMap = {
        "Arrival": "008025564b959483.JSON|1436cbe4-164b-450f-ad2c-77dec88f53dd",
        "Guided Training": "00f70f247a60e618.JSON|1d241b00-f585-4e3d-bc61-3095af1b96e2",
        "Freeform Training": "00b60c63e06f473a.JSON|b573932d-7a34-44f1-bcf4-ea8f79f75710",
    }
    mod.settings.replacing = replaceMap[document.getElementById("settingReplaces").value]
    if (document.getElementById("settingEnableTimer").checked) {
        mod.settings.timerEnabled = true
        mod.settings.timer = parseInt(document.getElementById("settingTimer").value.split(':').reduce((acc,time) => (60 * acc) + +time))
        mod.settings.timerFull = document.getElementById("settingTimer").value
    } else {
        mod.settings.timerEnabled = false
        mod.settings.timer = "NONE"
        mod.settings.timerFull = "NONE"
    }
    if (document.getElementById("settingBricks").value.toLowerCase() == "none" | document.getElementById("settingBricks").value == "") {
        mod.settings.bricks = "[]"
    } else {
        mod.settings.bricks = "[" + document.getElementById("settingBricks").value + "]"
    }
    document.getElementById("missionConfigStyling").style = "display: none"
}

function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}  

saveMissionScript = function() {
    var exitNodes = []
    var objectives = []
    var previous_id = "NONE"
    var objective_uuids = []
    for (item of mod.objectives) {
        if (item.type == "kill") {
            if (item.activation == "ACTIVE" || previous_id == "NONE") {
                var temp_id = uuidv4()
                objectives.push({
                    "Id": temp_id,
                    "IgnoreIfInactive": true,
                    "Category": "primary",
                    "Primary": true,
                    "ObjectiveType": "custom",
                    "Image": "images/contracts/AssRace/AssRaceTarget.jpg",
                    "BriefingName": "Kill " + item.targetName,
                    "SuccessEvent": {
                        "EventName": "Kill",
                        "EventValues": {
                            "RepositoryId": item.targetID
                        }
                    }
                })
                previous_id = temp_id
                objective_uuids.push(temp_id)
            } else if (item.activation == "PREVIOUS") {
                var temp_id = uuidv4()
                objectives.push({
                    "Id": temp_id,
                    "IgnoreIfInactive": true,
                    "Category": "primary",
                    "Primary": true,
                    "ObjectiveType": "custom",
                    "UpdateActivationWhileCompleted": true,
                    "Image": "images/contracts/AssRace/AssRaceTarget.jpg",
                    "BriefingName": "Kill " + item.targetName,
                    "Activation": {
                        "$eq": ["$" + previous_id, "Completed"]
                    },
                    "SuccessEvent": {
                        "EventName": "Kill",
                        "EventValues": {
                            "RepositoryId": item.targetID
                        }
                    },
                    "OnInactive": {
                        "IfCompleted": {
                            "State": "Completed",
                            "Visible": false
                        }
                    },
                    "OnActive": {
                        "IfCompleted": {
                            "Visible": true
                        }
                    }                    
                })
                previous_id = temp_id
                objective_uuids.push(temp_id)
            } else {
                var temp_id = uuidv4()
                objectives.push({
                    "Id": temp_id,
                    "IgnoreIfInactive": true,
                    "Category": "primary",
                    "Primary": true,
                    "ObjectiveType": "custom",
                    "UpdateActivationWhileCompleted": true,
                    "Image": "images/contracts/AssRace/AssRaceTarget.jpg",
                    "BriefingName": "Kill " + item.targetName,
                    "Activation": {
                        "$eq": ["$" + objective_uuids[item.activation - 1], "Completed"]
                    },
                    "SuccessEvent": {
                        "EventName": "Kill",
                        "EventValues": {
                            "RepositoryId": item.targetID
                        }
                    },
                    "OnInactive": {
                        "IfCompleted": {
                            "State": "Completed",
                            "Visible": false
                        }
                    },
                    "OnActive": {
                        "IfCompleted": {
                            "Visible": true
                        }
                    }                    
                })
                previous_id = temp_id
                objective_uuids.push(temp_id)
            }
            if (item.exitNode) {exitNodes.push(temp_id)}
        } else if (item.type == "complex") {
            if (item.activation == "ACTIVE" || previous_id == "NONE") {
                var temp_id = uuidv4()
                objectives.push(JSON.parse(`{"Id": "${temp_id}",
                "IgnoreIfInactive": true,
				"ObjectiveType": "custom",
				"Image": "images/contracts/AssRace/AssRaceTarget.jpg",
                "BriefingName": "${item.briefing}",
                "BriefingText": "${item.briefing}",
                "LongBriefingText" : "${item.briefing}",
                "HUDTemplate": {
                    "display": "${item.briefing}",
					"iconType": 13
                },
                "Primary": true,
				"Type": "statemachine",
                "Definition": {
					"Scope": "session",
                    "States": {
                        "Start": {
                            "${item.event}": [{
                                    "Transition": "Success"
                                }
                            ]
                        }
                    }
                }}`))
                previous_id = temp_id
                objective_uuids.push(temp_id)
            } else if (item.activation == "PREVIOUS") {
                var temp_id = uuidv4()
                objectives.push(JSON.parse(`{"Id": "${temp_id}",
                "IgnoreIfInactive": true,
				"ObjectiveType": "custom",
				"UpdateActivationWhileCompleted": true,
				"Image": "images/contracts/AssRace/AssRaceTarget.jpg",
                "BriefingName": "${item.briefing}",
                "BriefingText": "${item.briefing}",
                "LongBriefingText" : "${item.briefing}",
                "HUDTemplate": {
                    "display": "${item.briefing}",
					"iconType": 13
                },
                "Primary": true,
				"Type": "statemachine",
                "Activation": {
                    "$eq": ["$${previous_id}", "Completed"]
                },
                "Definition": {
					"Scope": "session",
                    "States": {
                        "Start": {
                            "${item.event}": [{
                                    "Transition": "Success"
                                }
                            ]
                        }
                    }
                },
                "OnInactive": {
                    "IfCompleted": {
                        "State": "Completed",
                        "Visible": false
                    }
                },
                "OnActive": {
                    "IfCompleted": {
                        "Visible": true
                    }
                }}`))
                previous_id = temp_id
                objective_uuids.push(temp_id)
            } else {
                var temp_id = uuidv4()
                objectives.push(JSON.parse(`{"Id": "${temp_id}",
                "IgnoreIfInactive": true,
				"ObjectiveType": "custom",
				"UpdateActivationWhileCompleted": true,
				"Image": "images/contracts/AssRace/AssRaceTarget.jpg",
                "BriefingName": "${item.briefing}",
                "BriefingText": "${item.briefing}",
                "LongBriefingText" : "${item.briefing}",
                "HUDTemplate": {
                    "display": "${item.briefing}",
					"iconType": 13
                },
                "Primary": true,
				"Type": "statemachine",
                "Activation": {
                    "$eq": ["$${objective_uuids[item.activation - 1]}", "Completed"]
                },
                "Definition": {
					"Scope": "session",
                    "States": {
                        "Start": {
                            "${item.event}": [{
                                    "Transition": "Success"
                                }
                            ]
                        }
                    }
                },
                "OnInactive": {
                    "IfCompleted": {
                        "State": "Completed",
                        "Visible": false
                    }
                },
                "OnActive": {
                    "IfCompleted": {
                        "Visible": true
                    }
                }}`))
                previous_id = temp_id
                objective_uuids.push(temp_id)
            }
            if (item.exitNode) {exitNodes.push(temp_id)}
        } else {
            if (item.activation == "ACTIVE" || previous_id == "NONE") {
                var temp_id = uuidv4()
                objectives.push(JSON.parse(`{
                    "Id": "${temp_id}",
                    "IgnoreIfInactive": true,
                    "ObjectiveType": "custom",
                    "Image": "images/contracts/AssRace/AssRaceTarget.jpg",
                    "BriefingName": "${item.briefing}",
                    "BriefingText": "${item.briefing}",
                    "LongBriefingText" : "${item.briefing}",
                    "HUDTemplate": {
                        "display": "${item.briefing}",
                        "iconType": 13
                    },
                    "Primary": true,
                    "Type": "statemachine",
                    "Definition": {
                        "Scope": "session",
                        "States": {
                            "Start": {
                                "${item.event}": [{
                                        "Condition": {
                                            "$eq": ["$Value.RepositoryId", "${item.targetID}"]
                                        },
                                        "Transition": "Success"
                                    }
                                ]
                            }
                        }
                    }}`))
                previous_id = temp_id
                objective_uuids.push(temp_id)
            } else if (item.activation == "PREVIOUS") {
                var temp_id = uuidv4()
                objectives.push(JSON.parse(`{
                    "Id": "${temp_id}",
                    "IgnoreIfInactive": true,
                    "ObjectiveType": "custom",
                    "UpdateActivationWhileCompleted": true,
                    "Image": "images/contracts/AssRace/AssRaceTarget.jpg",
                    "BriefingName": "${item.briefing}",
                    "BriefingText": "${item.briefing}",
                    "LongBriefingText" : "${item.briefing}",
                    "HUDTemplate": {
                        "display": "${item.briefing}",
                        "iconType": 13
                    },
                    "Primary": true,
                    "Type": "statemachine",
                    "Activation": {
                        "$eq": ["$${previous_id}", "Completed"]
                    },
                    "Definition": {
                        "Scope": "session",
                        "States": {
                            "Start": {
                                "${item.event}": [{
                                        "Condition": {
                                            "$eq": ["$Value.RepositoryId", "${item.targetID}"]
                                        },
                                        "Transition": "Success"
                                    }
                                ]
                            }
                        }
                    },
                    "OnInactive": {
                        "IfCompleted": {
                            "State": "Completed",
                            "Visible": false
                        }
                    },
                    "OnActive": {
                        "IfCompleted": {
                            "Visible": true
                        }
                    }
                }`))
                previous_id = temp_id
                objective_uuids.push(temp_id)
            } else {
                var temp_id = uuidv4()
                objectives.push(JSON.parse(`{
                    "Id": "${temp_id}",
                    "IgnoreIfInactive": true,
                    "ObjectiveType": "custom",
                    "UpdateActivationWhileCompleted": true,
                    "Image": "images/contracts/AssRace/AssRaceTarget.jpg",
                    "BriefingName": "${item.briefing}",
                    "BriefingText": "${item.briefing}",
                    "LongBriefingText" : "${item.briefing}",
                    "HUDTemplate": {
                        "display": "${item.briefing}",
                        "iconType": 13
                    },
                    "Primary": true,
                    "Type": "statemachine",
                    "Activation": {
                        "$eq": ["$${objective_uuids[item.activation - 1]}", "Completed"]
                    },
                    "Definition": {
                        "Scope": "session",
                        "States": {
                            "Start": {
                                "${item.event}": [{
                                        "Condition": {
                                            "$eq": ["$Value.RepositoryId", "${item.targetID}"]
                                        },
                                        "Transition": "Success"
                                    }
                                ]
                            }
                        }
                    },
                    "OnInactive": {
                        "IfCompleted": {
                            "State": "Completed",
                            "Visible": false
                        }
                    },
                    "OnActive": {
                        "IfCompleted": {
                            "Visible": true
                        }
                    }
                }`))
                previous_id = temp_id
                objective_uuids.push(temp_id)
            }
            if (item.exitNode) {exitNodes.push(temp_id)}
        }
    }
    if (mod.settings.timerEnabled) {
        objectives.push({
            "Type": "statemachine",
            "Id": uuidv4(),
            "ObjectiveType": "custom",
            "Category": "primary",
            "BriefingName": "$loc UI_CONTRACT_UGC_TIME_LIMIT_NAME",
            "BriefingText": {
                "$loc": {
                    "key": "UI_CONTRACT_UGC_TIME_LIMIT_SECONDARY_DESC",
                    "data": "$formatstring " + mod.settings.timerFull
                }
            },
            "LongBriefingText": {
                "$loc": {
                    "key": "UI_CONTRACT_UGC_TIME_LIMIT_SECONDARY_DESC",
                    "data": "$formatstring " + mod.settings.timerFull
                }
            },
            "HUDTemplate": {
                "display": {
                    "$loc": {
                        "key": "UI_CONTRACT_UGC_TIME_LIMIT_SECONDARY_DESC",
                        "data": "$formatstring " + mod.settings.timerFull
                    }
                }
            },
            "Image": "images/contractconditions/condition_contrac_time_limit.jpg",
            "CombinedDisplayInHud": true,
            "Definition": {
                "Scope": "session",
                "States": {
                    "Start": {
                        "IntroCutEnd": [{
                                "Transition": "TimerRunning"
                            }
                        ]
                    },
                    "TimerRunning": {
                        "exit_gate": [{
                                "Transition": "Success"
                            }
                        ],
                        "$timer": [{
                                "Condition": {
                                    "$after": mod.settings.timer
                                },
                                "Transition": "Failure"
                            }
                        ]
                    }
                }
            }
        })
    }
    var exitNodeCondition = {
        "$or": [
        ]
    }
    for (node of exitNodes) {
        exitNodeCondition["$or"].push({
            "$eq": ["$" + node, "Completed"]
        })
    }
    download(`{
        "Data": {
            "EnableExits": ${JSON.stringify(exitNodeCondition)},
            "EnableSaving": ${mod.settings.EnableSaving},
            "Objectives": ${JSON.stringify(objectives)},
            "Bricks": ${mod.settings.bricks},
            "GameChangers": [],
            "GameChangerReferences": [],
            "GameDifficulties": [],
            "SimulationQualities": []
        },
        "Metadata": {
            "Id": "${mod.settings.replacing.split("|")[1]}",
            "IsPublished": true,
            "CreationTimestamp": "2015-07-02T15:18:30.1639035+02:00",
            "CreatorUserId": "00000000-0000-0000-0000-000000000000",
            "Title": "${mod.settings.title}",
            "Description": "${mod.settings.description}",
            "TileImage": "images/challenges/categories/packneon/tile_unlock.jpg",
            "CodeName_Hint": "Polarbear Module 002_B",
            "ScenePath": "${mod.settings.location.split("|")[1]}",
            "Location": "${mod.settings.location.split("|")[0]}",
            "LastUpdate": "2015-03-11T13:50:08.347Z",
            "Type": "featured",
            "Release": "1.0.x"
        },
        "UserData": {}
    }`, mod.settings.replacing.split("|")[0], "text/json")
}

function download(text, name, type) {
    var a = document.createElement("a");
    var file = new Blob([text], {type: type});
    a.href = URL.createObjectURL(file);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}