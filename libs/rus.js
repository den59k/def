export function numeral(count, one, two, five){
	if(!count) count = 0;
	//десять-девятнадцать
	if(count%100/10>>0 === 1)
		return five;
	//ноль, пять-девять
	if(count%10 >= 5 || count%10===0)
		return five;
	//один
	if(count%10 === 1)
		return one;

	//две-четыре
	return two;
}

export function sortByKey (key, ret=1) {
	return (a, b) => {
		if(a[key] > b[key])
			return ret;
		
		if(a[key] < b[key])
			return -ret;

		return 0;
	}
}

export function getTime(timestamp){
	const time = new Date(timestamp);
	const nowDate = Date.now();
	const offset = time.getTimezoneOffset()*60*1000;

	const nowDay = (nowDate-offset)/(24*60*60*1000)>>0;
	const day = (timestamp-offset)/(24*60*60*1000)>>0;

	const minutes = (nowDate-timestamp)/(60*1000) >> 0;
	const hours = (minutes/60)>>0;

	if(nowDay-day === 0){
		if(minutes === 0) return "только что";
		if(minutes === 1) return 'минуту назад';
		if(hours < 1)
			return `${minutes} ${numeral(minutes, "минуту", "минуты", "минут")} назад`;
		else
			return `${hours === 1? '': hours+' '}${numeral(hours, "час", "часа", "часов")} назад`;

		return "сегодня";
	}else if(nowDay-day === 1)
		return 'вчера'
	else
		return time.getDate() + ' ' + StringMonth(time.getMonth());
}

export function getTimestamp(timestamp){
	const time = new Date(timestamp);
	const min = time.getMinutes();
	return time.getHours() + ':'+(min<10?'0'+min:min);
}

export function getDateTimestamp(timestamp){
	const time = new Date(timestamp);
	const day = time.getDate();
	const month = time.getMonth();
	const year = time.getFullYear();
	return day + '.'+( month < 10? '0'+month : month)+'.'+year;
}

export function getDate(timestamp, onlyDay){

	const time = new Date(timestamp);
	const nowDate = Date.now();
	const offset = time.getTimezoneOffset()*60*1000;

	const nowDay = (nowDate-offset)/(24*60*60*1000)>>0;

	const day = (timestamp-offset)/(24*60*60*1000)>>0;

	if(nowDay-day === 0){
		if(onlyDay === true)
			return "сегодня";
		const min = time.getMinutes();
		return time.getHours() + ':'+(min<10?'0'+min:min);
	}else if(nowDay-day === 1)
		return 'вчера'
	else
		return time.getDate() + ' ' + StringMonth(time.getMonth());
}

export function StringMonth(month){
	switch (month){
		case 0: return 'января'
		case 1: return 'февраля'
		case 2: return 'марта'
		case 3: return 'апреля'
		case 4: return 'мая'
		case 5: return 'июня'
		case 6: return 'июля'
		case 7: return 'августа'
		case 8: return 'сентября'
		case 9: return 'октября'
		case 10: return 'ноября'
		case 11: return 'декабря'
		default: return month < 10?('0'+month):month
	}
}

export function currentDate(){
	const defDate = new Date();
	defDate.setMinutes(0);
	defDate.setHours(0);
	defDate.setMilliseconds(0);
	defDate.setSeconds(0);

	return defDate.getTime();
}	