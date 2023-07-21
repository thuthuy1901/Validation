// cách 2
function Validator2(formSelector) {
    // tim cha
    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
                //tim dc parent chua selector la out luon
            }

            element = element.parentElement;//neu ko thi elemet moi cu chay ra ngoai tim cha neu het cha thi ngung
        }
    }

    var formRules = {};

    var validatorRules = {
        required: function (value) {
            return value ? undefined : 'Vui long nhap lai';
        },
        email: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'Vui long nhap email';
        },
        min: function (min) {
            return function (value) {
                return value.length >= min ? undefined : `Vui long nhap toi thieu ${min} ki tu`;
            }
        },
        max: function (max) {
            return function (value) {
                return value.length <= max ? undefined : `Vui long nhap toi da ${max} ki tu`;
            }
        },
    }



    // lay ra form element
    var formElement = document.querySelector(formSelector);

    // ton tai thi moi thuc thi
    if (formElement) {
        var inputs = formElement.querySelectorAll('[name][rules]');
        for (var input of inputs) {

            var rules = input.getAttribute('rules').split('|');

            for (var rule of rules) {
                var ruleInfo; //chi khi rule co : moi dung toi
                var isRuleHasValue = rule.includes(':');

                if (isRuleHasValue) {
                    ruleInfo = rule.split(':');
                    rule = ruleInfo[0]; //lay func truoc :
                }

                var ruleFunc = validatorRules[rule];

                if (isRuleHasValue) {
                    ruleFunc = ruleFunc(ruleInfo[1]); // chay func trong ham co : 
                }

                // moi dau chua la mang nen can khai bao else de cho no thanh mang
                //sau do them cac ptu sau bang push
                if (Array.isArray(formRules[input.name])) {
                    formRules[input.name].push(ruleFunc);
                } else {
                    formRules[input.name] = [ruleFunc];
                }
            }

            // lang nghe su kien de validator (blur, change, oninput)
            input.onblur = handleValidate;
            input.oninput = handleClearError;
        }
        // ham thuc hien validate
        function handleValidate(event) {
            // console.log(event.target);
            var rules = formRules[event.target.name];
            var errorMessage;

            // di qua tung rule theo thu tu cai nao co loi thi show
            for (var rule of rules) {
                errorMessage = rule(event.target.value);
                if (errorMessage) break;
            }

            // console.log(errorMessage);
            if (errorMessage) {
                var formGroup = getParent(event.target, '.form-group');
                // console.log(formGroup);
                if (formGroup) {
                    formGroup.classList.add('invalid');
                    var formMessage = formGroup.querySelector('.form-message');
                    if (formMessage) {
                        formMessage.innerText = errorMessage;
                    }
                }
            }

            // co loi ra false
            return !errorMessage;
        }

        // ham clear mess loi
        function handleClearError(event) {
            var formGroup = getParent(event.target, '.form-group');
            if (formGroup.classList.contains('invalid')) {
                formGroup.classList.remove('invalid');
                var formMessage = formGroup.querySelector('.form-message');
                if (formMessage) {
                    formMessage.innerText = '';
                }

            }
        }
    }

    // xu ly hanh vi submit
    formElement.onsubmit = function (event) {
        event.preventDefault();

        var isValid = true;
        var inputs = formElement.querySelectorAll('[name][rules]');
        for (var input of inputs) {
            if (!handleValidate({ target: input })) {
                isValid = false;
            }
        }

        if (isValid) {
            alert('done');
        }
    }

}