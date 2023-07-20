
// đối tg
function Validator(options) {

    //tim parent chua the input va span
    function getParent(element, selector) {
        //neu ko dung thi element bang the cha moi dusng thi return ra ngoai
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    var selectorRules = {};
    // console.log(selectorRules);

    //hien thi mess khi sai
    function validator(inputElement, rule) {


        var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
        var errorMessage;

        var rules = selectorRules[rule.selector];

        //lay ra cac rule cua selector(check)
        for (var i = 0; i < rules.length; i++) {
            switch (inputElement.type) {
                case 'radio':
                case 'checkbox':
                    errorMessage = rules[i](
                        formElement.querySelector(rule.selector + ':checked')
                    );
                    break;
                default:
                    errorMessage = rules[i](inputElement.value);
            }
            if (errorMessage) break;
        }

        //hien thong bao loi khi rule dap ung
        if (errorMessage) {
            errorElement.innerText = errorMessage;
            getParent(inputElement, options.formGroupSelector).classList.add('invalid');
        }
        else {
            errorElement.innerHTML = '';
            getParent(inputElement, options.formGroupSelector).classList.remove('invalid');

        }

        // console.log(!errorElement);
        return !errorMessage;
    }

    // console.log(options);
    //lay element cua form can validate
    var formElement = document.querySelector(options.form);

    if (formElement) {
        formElement.onsubmit = function (e) {
            e.preventDefault();

            var isFormValid = true;

            options.rules.forEach(function (rule) {
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validator(inputElement, rule);
                if (!isValid) {
                    isFormValid = false;
                }
            });

            if (isFormValid) {
                //truong hop cp submit vs js
                if (typeof options.onSubmit === 'function') {

                    var enableInputs = formElement.querySelectorAll('[name]');
                    //xu ly Node
                    var formValues = Array.from(enableInputs).reduce(function (values, input) {
                        switch (input.type) {
                            case 'radio':
                                values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value;
                                break;
                            case 'checkbox':
                                if (!input.matches(':checked')) return values;
                                if (!Array.isArray(values[input.name])) {
                                    values[input.name] = [];
                                }
                                values[input.name].push(input.value);
                                break;
                            case 'file':
                                values[input.name] = input.files;
                                break;
                            default:
                                values[input.name] = input.value;
                        }
                        return values;
                    }, {});


                    options.onSubmit(formValues);
                }
                //truong hop hanh vi mac dinh
                else {
                    formElement.submit();
                }

            }
            console.log(formValues);
        }

        //Lap qua moi rule lang nghe xu ly
        options.rules.forEach(function (rule) {
            // console.log(rule);
            //luu lai cac rule 
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            }
            else {
                selectorRules[rule.selector] = [rule.test];
            }

            var inputElement = formElement.querySelectorAll(rule.selector);

            Array.from(inputElement).forEach(function (inputElement) {
                // xu ly blur ra khoi input
                inputElement.onblur = function () {
                    validator(inputElement, rule);
                }

                // xu ly khi nhap lai ko hien loi
                inputElement.oninput = function () {
                    var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
                    errorElement.innerHTML = '';
                    getParent(inputElement, options.formGroupSelector).classList.remove('invalid');

                }
            });

        })
    }
}

// định nghĩa Luật
// khi có lỗi -> mess
// không có lỗi -> undefined
Validator.isRequired = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            return value ? undefined : 'vui long nhap lai';
        }
    };
}

Validator.isEmail = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'vui long nhap email';
        }
    };
}

Validator.minLength = function (selector, min) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= min ? undefined : `Vui long nhap toi thieu ${min} ki tu`;
        }
    };
}

//khong co gia tri truyen vao lay luon
Validator.isConfirmed = function (selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function (value) {
            return value === getConfirmValue() ? undefined : message || 'gia tri khong dung';
        }
    };
}

Validator.isTelNumber = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            value = value.replace(/\s/g, '');
            var telNormal = /^\(?(0[0-9]{2})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
            var telUni = /^\+?([0-9]{2})\)?[-. ]?([0-9]{9})$/;
            return (value.match(telNormal) || value.match(telUni)) ? undefined : 'sdt khong dung';
        }
    }
}











