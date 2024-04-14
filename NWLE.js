const newsWebEasyURL = 'https://www3.nhk.or.jp/news/easy/*';
var style;
var sheet;
var article_top_tool;
var article_buttons;
var additional_buttons;
var article_body;
var people_names, place_names, org_names;
var easy_wrapper = document.getElementsByClassName("easy-wrapper")[0];
var old_ruby_button,all_toggle_button, people_name_button, place_name_button, org_name_button;

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	if (message.action === "initialize") {
		Grab_Elements();
		Add_CSS();
		Initialize_Buttons();
	}
});

document.addEventListener('click', function(event) {
    if (event.target) {
		if(Is_Button_ID(event.target))
		{
			event.preventDefault();
			Handle_ButtonPress(event.target.getAttribute('id'));
		}
		
		setTimeout(function(){
			chrome.runtime.sendMessage({buttonClicked: true});
		},
		100);
    }
});

function Grab_Elements()
{
	article_top_tool = document.getElementsByClassName("article-top-tool");
	article_buttons = document.getElementsByClassName("article-buttons");
	article_body = document.getElementsByClassName("article-body");
	old_ruby_button = document.getElementsByClassName("article-buttons__ruby")[0];
	old_ruby_button.setAttribute('id', 'all-kanji-button');
}

function Add_CSS()
{
	//Color C = organization name
	//Color N = person's name
	//Color L = place name
	style = document.createElement("style");
	document.head.appendChild(style);
	sheet = style.sheet;
	sheet.insertRule("#easy-wrapper.is-no-ruby.with-all .colorC rt {visibility: visible;}")
	sheet.insertRule("#easy-wrapper.is-no-ruby.with-all .colorN rt {visibility: visible;}")
	sheet.insertRule("#easy-wrapper.is-no-ruby.with-all .colorL rt {visibility: visible;}")
	sheet.insertRule("#easy-wrapper.is-no-ruby.with-people .colorN rt {visibility: visible;}")
	sheet.insertRule("#easy-wrapper.is-no-ruby.with-place .colorL rt {visibility: visible;}")
	sheet.insertRule("#easy-wrapper.is-no-ruby.with-org .colorC rt {visibility: visible;}")
	sheet.insertRule(".extra-button {margin: 5px;}")
}

function Initialize_Buttons()
{	  
	all_toggle_button = Create_Button('all-toggler', '全ての名前の読み方のトグル');
	people_name_button = Create_Button('people-name-button', '人名の読み方<br>のトグル');
	place_name_button = Create_Button('place-name-button', '地名の読み方<br>のトグル');
	org_name_button = Create_Button('org-name-button','グループの読み方<br>のトグル');
	
	additional_buttons = document.createElement("div");
	additional_buttons.classList.add("article-buttons");
	additional_buttons.appendChild(all_toggle_button);
	additional_buttons.appendChild(people_name_button);
	additional_buttons.appendChild(place_name_button);
	additional_buttons.appendChild(org_name_button);
	article_top_tool[0].appendChild(additional_buttons);
	
}

function Create_Button(button_id, button_text)
{
	var new_button = document.createElement("a");
	new_button.setAttribute('href', '#');
	new_button.setAttribute('id', button_id);
	new_button.classList.add('article-buttons__ruby');
	new_button.classList.add('js-toggle-ruby');
	new_button.classList.add('--pc');
	new_button.classList.add('extra-button');
	new_button.innerHTML = button_text;
	
	return new_button;
}

function Handle_ButtonPress(button_id)
{
	if(!easy_wrapper.classList.contains('is-no-ruby') && button_id != 'all-kanji-button')
	{
		easy_wrapper.classList.add('is-no-ruby')
		old_ruby_button.innerHTML = old_ruby_button.innerHTML.replace('<ruby>消<rt>け</rt></ruby>す','つける');
	}
	switch(button_id)
	{
		case 'all-kanji-button':
			easy_wrapper.classList.toggle('with-people', false);
			easy_wrapper.classList.toggle('with-place', false);
			easy_wrapper.classList.toggle('with-org', false);	
			console.log("old button pressed");
			break;
		case 'all-toggler':
			old_ruby_button.classList.toggle('is-active', true);
			if(Are_All_Toggles_Active())
			{
				easy_wrapper.classList.toggle('with-people', false);
				easy_wrapper.classList.toggle('with-place', false);
				easy_wrapper.classList.toggle('with-org', false);	
			}
			else
			{
				easy_wrapper.classList.toggle('with-people', true);
				easy_wrapper.classList.toggle('with-place', true);
				easy_wrapper.classList.toggle('with-org', true);	
			}
			console.log("Toggle All");
			break;
		case 'people-name-button':
			old_ruby_button.classList.toggle('is-active', true);
			easy_wrapper.classList.toggle('with-people');
			console.log("Toggle People");
			break;
		case 'place-name-button':
			old_ruby_button.classList.toggle('is-active', true);
			easy_wrapper.classList.toggle('with-place');
			console.log("Toggle Place");
			break;
		case 'org-name-button':
			old_ruby_button.classList.toggle('is-active', true);
			easy_wrapper.classList.toggle('with-org');
			console.log("Toggle org");
			break;
		default:
			break;
	}
}

function Are_All_Toggles_Active()
{
	if(easy_wrapper.classList.contains('with-people') && easy_wrapper.classList.contains('with-place')
		&& easy_wrapper.classList.contains('with-org'))
	{
		return true;
	}
	
	return false;
}

function Is_Button_ID(target)
{
	if(target.matches('#all-toggler') || target.matches('#people-name-button')
		|| target.matches('#place-name-button') || target.matches('#org-name-button')
		|| target.matches('#all-kanji-button'))
	{
		return true;
	}
	
	return false;
}