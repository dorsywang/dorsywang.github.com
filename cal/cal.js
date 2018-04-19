var DELTA_YEAR_BEFORE = 20;

var taxRateArr = [
	[1500, 0.03, 0],
	[4500, 0.1, 105],
	[9000, 0.2, 555],
	[35000, 0.25, 1005],
	[55000, 0.3, 2755],
	[80000, 0.35, 5505], 
	[Infinity, 0.45, 13505]
];
var getTaxRate = function(monthSal){
	var rate, delta;

	for(var i = 0; i < taxRateArr.length; i ++){
		var item = taxRateArr[i];
		if(monthSal < item[0]){
			rate = item[1];
			delta = item[2];

			break;
		}
	}

	return {
		rate: rate,
		delta: delta
	}

};

var calMonthTax = function(monthSal){
	var taxRate = getTaxRate(monthSal);
	var tax = monthSal * taxRate.rate - taxRate.delta;

	return {
		tax: tax,
		taxRate: taxRate
	}
};

var calYearBonusTax = function(sal){
	var taxRate = getTaxRate(sal / 12);
	var tax = sal * taxRate.rate - taxRate.delta;

	return {
		tax: tax,
		taxRate: taxRate
	};
}

var calNoTaxDe = function(allBonus){
	var tax = calYearBonusTax(allBonus);

	return tax;
};

var getYearBeforeBonus = function (allBonus){
	var limitArr = [0, 1500, 4500, 9000, 35000, 55000, 80000];
	var monthBonus = allBonus / 12;

	var monthLimit;
	for(var i = 0; i < limitArr.length; i ++){
		if(monthBonus < limitArr[i]){
			monthLimit = limitArr[i - 1];
			break;
		}
	}

	return monthLimit * 12;
};
var getMonthTaxRateFromMonTax = function(monTax){
	var rate, delta;

	for(var i = 0; i < taxRateArr.length; i ++){
		var item = taxRateArr[i];

		if(monTax < item[0] * item[1] - item[2]){
			return {
				rate: item[1],
				delta: item[2]
			}
		}
	}
};

var calYearAfterTax = function(sal, monTax){
	var monTaxRate = getMonthTaxRateFromMonTax(monTax);
	var monTaxRefer = (monTax + monTaxRate.delta) / monTaxRate.rate;

	var allSal = monTaxRefer + sal;
	var tax = calMonthTax(allSal);

	return {
		tax: tax.tax - monTax,
		historyMonTaxRate: monTaxRate,
		monTaxRefer: monTaxRefer,
		currMonTax: tax,
		monTax: monTax
	}
};
function format(num) {  
   function toThousands(num) {  
	    var result = [ ], counter = 0;  
	    num = (num || 0).toString().split('');  
	    for (var i = num.length - 1; i >= 0; i--) {  
	        counter++;  
	        result.unshift(num[i]);  
	        if (!(counter % 3) && i != 0) { result.unshift(','); }  
	    }  
	    return result.join('');  
	}  

	var initNum = ~~ num;

	var formatNum = toThousands(initNum);

	return (num + '').replace(initNum, formatNum)
}  
var calTaxDe = function(allBonus, monTax){
	var yearBeforeBonus= getYearBeforeBonus(allBonus) - 20;
    if(yearBeforeBonus < 0){
        yearBeforeBonus = 0;
    }

	var yearAfterBonus = allBonus - yearBeforeBonus;

	var yearBeforeTax = calYearBonusTax(yearBeforeBonus);


	var yearAfterTax = calYearAfterTax(yearAfterBonus, monTax);

	var allTax = yearBeforeTax.tax + yearAfterTax.tax;

	return {
		yearBeforeBonus: yearBeforeBonus,
		yearAfterBonus: yearAfterBonus,
		yearBeforeTax, yearBeforeTax,
		yearAfterTax: yearAfterTax,
		allTax: allTax
	}
};

var get = function(id){
	var el = document.getElementById(id);
	return el.value;
};
var cal = function(){
	var inputYearAfter = Number(get('inputYearAfter'))
	var inputDe = Number(get('inputDe'));
	var inputTax = Number(get('inputTax'));

	if(isNaN(inputYearAfter) || inputYearAfter < 1){
		alert('请输入年后发放')
		return;
	}

	if(isNaN(inputDe) || inputDe < 0){
		alert('请输入节省')
		return;
	}

	if(isNaN(inputTax) || inputTax < 1){
		alert('请输入上月个税')
		return;
	}



	var resultArr = [];
	var minDelta = Infinity;
	var index = -1;
	for(var i = 0; i < taxRateArr.length; i ++){
		var item = taxRateArr[i];

		var fakeAllBonus = item[0] * 12 - DELTA_YEAR_BEFORE + inputYearAfter;

		var noDetax = calNoTaxDe(fakeAllBonus);
		var deTax = calTaxDe(fakeAllBonus, inputTax);

		var monRate = calMonthTax(deTax.yearAfterTax.monTaxRefer);
		var taxDelta =  (deTax.yearAfterTax.currMonTax.tax + deTax.yearBeforeTax.tax) - (noDetax.tax + monRate.tax);

		resultArr.push({
			fakeAllBonus: fakeAllBonus,
			noDetax: noDetax,
			deTax: deTax,
			monRate: monRate,
			taxDelta: taxDelta
		});

		var d = Math.abs(- taxDelta - inputDe);


		if(d < minDelta){
			minDelta = d;
			index = i;
		}
	}


	if(resultArr[index]){
		var item = resultArr[index];
		var allBonus = item.fakeAllBonus;

		var noDetax = item.noDetax;
		var deTax = item.deTax;

		var monRate = item.monRate;
		var taxDelta =  item.taxDelta;



        console.log(minDelta, 'xx');
		showResult(allBonus, deTax, noDetax, monRate);

	}else{
		alert('计算有误')
		document.getElementById('result').style.display = 'none';
	}

}


var calWithAllBonus = function(){
    var inputYearBonus = Number(get('inputYearBonus'))
	var inputTax = Number(get('inputTax2'));

   if(isNaN(inputYearBonus) || inputYearBonus < 1){
		alert('请输入总年终奖')
		return;
	}


	if(isNaN(inputTax) || inputTax < 1){
		alert('请输入上月个税')
		return;
	}

    var noDetax = calNoTaxDe(inputYearBonus);
    var deTax = calTaxDe(inputYearBonus, inputTax);

    var monRate = calMonthTax(deTax.yearAfterTax.monTaxRefer);
    var taxDelta =  (deTax.yearAfterTax.currMonTax.tax + deTax.yearBeforeTax.tax) - (noDetax.tax + monRate.tax);



    showResult(inputYearBonus, deTax, noDetax, monRate);

};

document.getElementById('cal').onclick = function(){
    if(curr_type === 'diff'){
        cal();
    }else{
        calWithAllBonus();
    }
};

var set = function(id, text){
	document.getElementById(id).innerHTML = "<span class='num'>" + format(Number(text.toFixed(2))) + "</span>";
};
var showResult = function(allBonus, deResult, noDeResult, monRate){
	document.getElementById('result').style.display = 'block';
	document.getElementById('note').style.display = 'none';

	set('allBonus', allBonus);
	set('yearBonus', deResult.yearBeforeBonus);
	set('yearBonusGet', deResult.yearBeforeBonus - deResult.yearBeforeTax.tax);
	set('yearBonusGet2', deResult.yearBeforeBonus);
	set('averBonus', deResult.yearBeforeBonus / 12)
	set('yearRate', deResult.yearBeforeTax.taxRate.rate)
	set('yearDelta', deResult.yearBeforeTax.taxRate.delta)
	set('yearTax', deResult.yearBeforeTax.tax)
	set('yearAfterBonus', deResult.yearAfterBonus)
	set('yearAfterBonusGet', deResult.yearAfterBonus - deResult.yearAfterTax.tax + deResult.yearAfterTax.monTaxRefer - deResult.yearAfterTax.monTax + 3500)
	set('monthRefer', deResult.yearAfterTax.monTaxRefer)
	set('yearAfterGet', deResult.yearAfterBonus)
	set('yearAfterSum', deResult.yearAfterTax.monTaxRefer + deResult.yearAfterBonus);
	set('yearAfterRato', deResult.yearAfterTax.currMonTax.taxRate.rate)
	set('yearAfterDelta', deResult.yearAfterTax.currMonTax.taxRate.delta)
	set('yearAfterTax', deResult.yearAfterTax.currMonTax.tax)
	set('allTaxDe', deResult.yearAfterTax.currMonTax.tax + deResult.yearBeforeTax.tax)

	set('yearBonusNoDe', allBonus);
	set('yearBonusGetNoDe', allBonus - noDeResult.tax)

	set('yearBonusGet2NoDe', allBonus)
	set('averBonusNoDe', allBonus / 12)
	set('yearRateNoDe', noDeResult.taxRate.rate)
	set('yearDeltaNoDe', noDeResult.taxRate.delta)
	set('yearTaxNoDe', noDeResult.tax)

	set('monTaxNoDe', monRate.tax)

	var taxDelta =  (deResult.yearAfterTax.currMonTax.tax + deResult.yearBeforeTax.tax) - (noDeResult.tax + monRate.tax);
	set('taxDelta',  taxDelta)

};

var curr_type = 'diff';

document.getElementById('diff').onclick = function(){
    curr_type = 'diff';

    document.getElementById('diffOpt').style.display = 'block';
    document.getElementById('dircOpt').style.display = 'none';
};

document.getElementById('dire').onclick = function(){
    curr_type = 'dire';

    document.getElementById('diffOpt').style.display = 'none';
    document.getElementById('dircOpt').style.display = 'block';
};
