import $ from "./lib/jquery-3.2.1.min.js";
import FileSaver from "./lib/file-saver.min.js";
import X2JS from "./lib/xml2json.min.js";

import KvpManager from "./kvp-manager.js";

$(document).ready(function()
{
	"use strict";
	
	
	var kvpList = new KvpManager();
	
	
	var kvpListNode = $(".kvp-list");
	var selectedNode = null;
	kvpListNode.on("click", (event) =>
	{
		if (selectedNode !== null)
			selectedNode.removeClass("selected");
		
		if (event.target.tagName !== "LI")
		{
			selectedNode = null;
			return;
		}
		
		selectedNode = $(event.target);
		selectedNode.addClass("selected");
	});
	
	
	var addInputNode = $(".add-input");
	var errorMessageNode = $(".error-message");
	addInputNode.on("focus", (event) =>
	{
		errorMessageNode.removeClass("show");
		if (addInputNode.val() === addInputNode.get(0).defaultValue)
		{
			addInputNode.val("");
			addInputNode.removeClass("no-value");
		}
	});
	addInputNode.on("keyup", (event) =>
	{
		if (event.keyCode === 13)
		{
			$(".add").click();
			addInputNode.blur();
		}
	});
	
	addInputNode.on("blur", (event) =>
	{
		if (addInputNode.val() === "")
		{
			addInputNode.val(addInputNode.get(0).defaultValue);
			addInputNode.addClass("no-value");
		}
	});
	
	$(".add").on("click", () =>
	{
		var toAdd = addInputNode.val();
		try
		{
			kvpList.add(toAdd);
			addInputNode.val("");
			addInputNode.blur();
			drawList();
		}
		catch (e)
		{
			errorMessageNode.text(e.message);
			errorMessageNode.addClass("show");
		}
	});
	
	$(".remove").on("click", () =>
	{
		if (selectedNode === null)
			return;
		
		var key = selectedNode.text().split("=")[0];
		if (kvpList.remove(key))
		{
			selectedNode.remove();
		}
	});
	
	$(".clear").on("click", () =>
	{
		kvpList.clear();
		drawList();
		addInputNode.val("");
		addInputNode.blur();
	});
	
	$(".download-xml").on("click", () =>
	{
		var json = kvpList.toJSON();
		var xml = (new X2JS()).json2xml_str(json);
		FileSaver.saveAs(new Blob([xml], {
			"type": "text/plain;charset=utf8"
		}), "Keys-Values-Xml.txt");
	});
	
	$(".download-json").on("click", () =>
	{
		var json = JSON.stringify(kvpList.toJSON(), null, "\t");
		FileSaver.saveAs(new Blob([json], {
			"type": "text/plain;charset=utf8"
		}), "Keys-Values-Json.txt");
	});
	
	$(".sort-by-name").on("click", () =>
	{
		var list = kvpList.asArray();
		list.sort((a, b) => 
		{
			if (a[0].toUpperCase() < b[0].toUpperCase())
				return -1;
			if (a[0].toUpperCase() > b[0].toUpperCase())
				return 1;
			
			return 0;
		});
		
		drawList(list);
	});
	
	$(".sort-by-value").on("click", () =>
	{
		var list = kvpList.asArray();
		list.sort((a, b) => 
		{
			if (a[1].toUpperCase() < b[1].toUpperCase())
				return -1;
			if (a[1].toUpperCase() > b[1].toUpperCase())
				return 1;
			
			return 0;
		});
		
		drawList(list);
	});
	
	
	
	function drawList(list = null)
	{
		kvpListNode.empty();
		
		if (list === null)
		{
			list = kvpList.asArray();
		}
		
		list.forEach((entry) =>
		{
			kvpListNode.append($(`<li>${entry[0]}=${entry[1]}</li>`));
		});
	}
	drawList();
	
	
	
});