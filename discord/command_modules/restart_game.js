
const Command = require("../prototypes/command.js");
const CommandData = require("../prototypes/command_data.js");
const commandPermissions = require("../command_permissions.js");
const MessagePayload = require("../prototypes/message_payload.js");

const commandData = new CommandData("RESTART_GAME");

module.exports = RestartGameCommand;

function RestartGameCommand()
{
    const restartGameCommand = new Command(commandData);

    restartGameCommand.addBehaviour(_behaviour);

    restartGameCommand.addRequirements(
        commandPermissions.assertCommandIsUsedInGameChannel,
        commandPermissions.assertServerIsOnline,
        commandPermissions.assertGameIsOnline,
        commandPermissions.assertMemberIsTrusted,
        commandPermissions.assertMemberIsOrganizer
    );

    return restartGameCommand;
}

function _behaviour(commandContext)
{
    const targetedGame = commandContext.getGameTargetedByCommand();

    return commandContext.respondToCommand(new MessagePayload(`Restarting game...`))
    .then(() => targetedGame.emitPromiseWithGameDataToServer("RESTART_GAME"))
    .then(() => targetedGame.removeNationClaims())
    .then(() => commandContext.respondToCommand(new MessagePayload(`The game has been restarted. It may take a minute or two to update properly.`)))
    .catch((err) => commandContext.respondToCommand(new MessagePayload(`An error occurred:\n\n${err.message}`)));
}