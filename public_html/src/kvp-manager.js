class KvpManager
{
	constructor()
	{
		this._entries = new Map();

		var saved = localStorage.getItem("kvp-list");
		if (saved === null)
			return;

		saved = JSON.parse(saved);
		for (var key in saved)
		{
			this._entries.set(key, saved[key]);
		}
	}

	_validateString(toValidate)
	{
		if (toValidate.length === 0)
			throw new Error("Names cannot be blank.");

		var result = toValidate.match(/^[a-z0-9]+$/i);
		if (result === null)
			throw new Error("Invalid character(s) found. Use only alpha-numeric characters for keys and values.");
	}

	add(key, value = null)
	{
		if (value === null)
		{
			key = key.split("=");
			if (key.length < 2)
				throw new Error("Delimiter missing. Use '=' to separate the Key from the Value.");
			if (key.length > 2)
				throw new Error("Too many delimiters provided. Keys and Values cannot contain an '=' character.");

			value = key[1];
			key = key[0];
		}

		key = key.trim();
		value = value.trim();

		this._validateString(key);
		this._validateString(value);

		if (this._entries.has(key))
			throw Error(`The name '${key}' already exists in the list.`);

		this._entries.set(key, value);

		this.save();
	}

	get(key)
	{
		return this._entries.get(key);
	}

	has(key)
	{
		return this._entries.has(key);
	}

	remove(key)
	{
		var toReturn = this._entries.delete(key);
		if (toReturn)
			this.save();

		return toReturn;
	}

	clear()
	{
		this._entries.clear();
		this.save();
	}
	
	each(func)
	{
		this._entries.forEach(func);
	}
	
	asArray()
	{
		return Array.from(this._entries);
	}
	
	toJSON()
	{
		var toReturn = {};
		this._entries.forEach((value, key) =>
		{
			toReturn[key] = value;
		});

		return toReturn;
	}
	
	save()
	{
		localStorage.setItem("kvp-list", JSON.stringify(this.toJSON()));
	}
};

export default KvpManager;