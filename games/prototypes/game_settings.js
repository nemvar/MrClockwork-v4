
const assert = require("../../asserter.js");

module.exports = GameSettings;

function GameSettings(parentGame)
{
    const _settingObjectsArray = [];
    const _parentGame = parentGame;

    this.addSettingObjects = (...settingObjects) =>
    {
        settingObjects.forEach((settingObject) =>
        {
            validateSettingObjectOrThrow(settingObject);
            _settingObjectsArray.push(settingObject);
        });
    };

    this.forEachSettingObject = (doSomething) =>
    {
        _settingObjectsArray.forEach((settingObject) =>
        {
            doSomething(settingObject, settingObject.getKey());
        });
    };

    this.forEachSettingObjectPromise = (doSomething) =>
    {
        return _settingObjectsArray.forEachPromise((settingObject, index, nextPromise) =>
        {
            return Promise.resolve(doSomething(settingObject, settingObject.getKey()))
            .then(() => nextPromise());
        });
    };

    this.loadJSONData = (jsonData) =>
    {
        console.log("Loading JSON data...", jsonData);
        this.forEachSettingObject((settingObject, settingKey) =>
        {
            var loadedValue = jsonData[settingKey];

            console.log(`Loading ${settingKey}`);

            if (loadedValue !== undefined)
                settingObject.fromJSON(loadedValue);

            else console.log(`${settingKey} is undefined.`);
        });
    };

    this.getSettingByKey = (keyToMatch) =>
    {
        var setting;

        this.forEachSettingObject((settingObject, settingKey) =>
        {
            if (keyToMatch.toLowerCase() === settingKey.toLowerCase())
                setting = settingObject;
        });

        return setting;
    };

    this.getSettingFlags = () =>
    {
        var server = _parentGame.getServer();
        var flags = ["--tcpserver", "--ipadr", server.getIp(), "--port", _parentGame.getPort()];

        this.forEachSettingObject((settingObject) =>
        {
            const key = settingObject.getKey();
            const flag = settingObject.translateValueToCmdFlag();

            if (key !== "name")
                flags = flags.concat(flag);
        });

        flags.push(_parentGame.getName());

        return flags;
    };

    this.getSettingsStringList = () =>
    {
        var stringList = "";

        this.forEachSettingObject((settingObject, settingKey) =>
        {
            var name = settingObject.getName();
            var readableValue = settingObject.getReadableValue();
            stringList += `${name}: ${readableValue}\n`;
        });

        return stringList;
    };

    this.getPublicSettingsStringList = () =>
    {
        var stringList = "";

        this.forEachSettingObject((settingObject, settingKey) =>
        {
            if (settingKey !== "masterPassword")
            {
                var name = settingObject.getName();
                var readableValue = settingObject.getReadableValue();
                stringList += `${name}: ${readableValue}\n`;
            }
        });

        return stringList;
    };

    this.toJSON = () =>
    {
        var jsonData = {};

        this.forEachSettingObject((settingObject, settingKey) =>
        {
            jsonData[settingKey] = settingObject.getValue();
        });

        return jsonData;
    };
}

function validateSettingObjectOrThrow(settingObject)
{
    assert.isFunctionOrThrow(settingObject.setValue);
    assert.isFunctionOrThrow(settingObject.getValue);
    assert.isFunctionOrThrow(settingObject.getKey);
    assert.isFunctionOrThrow(settingObject.getName);
    assert.isFunctionOrThrow(settingObject.getPrompt);
    assert.isFunctionOrThrow(settingObject.translateValueToCmdFlag);
}