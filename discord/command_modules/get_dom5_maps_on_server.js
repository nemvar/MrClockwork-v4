
const Command = require("../prototypes/command.js");
const CommandData = require("../prototypes/command_data.js");
const hostServerStore = require("../../servers/host_server_store.js");
const MessagePayload = require("../prototypes/message_payload.js");

const commandData = new CommandData("GET_DOM5_MAPS_ON_SERVER");

module.exports = GetDom5MapsOnServerCommand;

function GetDom5MapsOnServerCommand()
{
    const getDom5MapsOnServerCommand = new Command(commandData);

    getDom5MapsOnServerCommand.addBehaviour(_behaviour);

    return getDom5MapsOnServerCommand;
}

function _behaviour(commandContext)
{
    const commandArguments = commandContext.getCommandArgumentsArray();
    const targetedServerName = commandArguments[0];
    var targetedServerObject;

    if (targetedServerName == null)
        return commandContext.respondToCommand(new MessagePayload(`You must specify a server name from the ones available below:\n\n${hostServerStore.printListOfOnlineHostServers().toBox()}`));

    if (hostServerStore.hasHostServerByName(targetedServerName) === false)
        return commandContext.respondToCommand(new MessagePayload(`Selected server does not exist.`));

    targetedServerObject = hostServerStore.getHostServerByName(targetedServerName);

    if (targetedServerObject.isOnline() === false)
        return commandContext.respondToCommand(new MessagePayload(`Selected server is offline.`));

    return getListOfMapsOnServerAndSend(targetedServerObject, commandContext);
}

function getListOfMapsOnServerAndSend(serverObject, commandContext)
{
    const payload = new MessagePayload("Below is the list of maps available:\n\n");
    var stringList = "";

    return commandContext.respondToCommand(new MessagePayload(`Fetching maps, this may take a while...`))
    .then(() => serverObject.getDom5MapsOnServer())
    .then((list) =>
    {
        if (list.length <= 0)
            return commandContext.respondToCommand("No maps are available on this server.");

        list.forEach((map) => stringList += `${(map.name).width(48)} (${map.land.toString().width(4)} land, ${map.sea.toString().width(3)} sea).\n`);
        payload.setAttachment("maps.txt", Buffer.from(stringList));

        return commandContext.respondToCommand(payload);
    });
}