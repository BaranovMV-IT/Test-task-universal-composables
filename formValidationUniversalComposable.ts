import { reactive, computed } from 'vue';

interface FieldRule {
  regex: string;
  message: string;
}

interface FieldConfig {
  value: string;
  rules: FieldRule[];
}

type FormConfig = Record<FieldConfig>

interface FieldState {
  value: string;
  errors: string[];
  valid: boolean;
}

const formData = reactive<FormConfig>({
    username: {
      value: 'ва',
      rules: [
        {
          regex: "[a-zA-Z0-9]$",
          message: 'Username format is incorrect'
        },
        {
          regex: "^.{4,12}$",
          message: 'Username length is incorrect'
        }
      ]
    },
    password: {
      value: 'a123',
      rules: [
        {
          regex: "(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,32}$",
          message: 'Password format or length is incorrect'
        }
      ]
    }
});

export function useFormValidation(formConfig: FormConfig){
  const fieldsState = reactive<FieldState>({});

  for(const fieldName of Object.keys(formConfig)){
    const field = formConfig[fieldName];
    fieldsState[fieldName] = reactive({
      value: field.value,
      errors: [],
      valid: true
    })
  }

  const validateField = (fieldName: string): boolean => {
    const field = formConfig[fieldName];
    const state = fieldsState[fieldName];

    state.errors = [];
    state.valid = true;

    if(field.rules){
      for(const rule of field.rules){
        const regex = new RegExp(rule.regex);
        const result = regex.test(state.value);
        if(result === false){
          state.errors.push(rule.message);
          state.valid = false;
        }
      }
    }
    return state.valid
  };

  const validateForm = (): boolean => {
    for(const fieldName of Object.keys(formConfig)){
      validateField(fieldName);
    }
  };

  validateForm();

  const isFormValid = computed((): boolean => {
    for(const fieldName of Object.keys(fieldsState)){
      if(fieldsState[fieldName].valid === false){
        return false
      }
    }
    return true
  });

  return {
    fields: fieldsState,
    isFormValid: isFormValid
  }
}