// Default options for each field type
const getDefaultOptions = (type) => {
    switch (type) {
        case 'text':
        case 'textarea':
            return { minLength: 0, maxLength: 255 }; // Default text length constraints
        case 'number':
            return { min: 0, max: 100 }; // Default numeric range
        case 'date':
            return { minDate: '1900-01-01', maxDate: '2100-12-31' }; // Default date range
        case 'file':
            return { minSize: 0, maxSize: 2048 }; // Default file size in KB
        case 'dropdown':
        case 'checkbox':
            return { choices: [] }; // Empty choices by default
        default:
            return {}; // Default empty object for other types
    }
};

// Validator for specific field types
const validateFieldOptions = (type, options) => {
    switch (type) {
        case 'text':
        case 'textarea':
            return !(options.minLength && options.maxLength && options.minLength > options.maxLength);
        case 'number':
            return !(options.min && options.max && options.min > options.max);
        case 'date':
            return !(options.minDate && options.maxDate && new Date(options.minDate) > new Date(options.maxDate));
        case 'file':
            return !(options.minSize && options.maxSize && options.minSize > options.maxSize);
        case 'dropdown':
        case 'checkbox':
            return Array.isArray(options.choices);
        default:
            return true; // No validation for other types
    }
};

const formFieldSchema = new mongoose.Schema({
    label: { type: String, required: true }, 
    name: { type: String, required: true, unique: true },
    type: {
        type: String,
        required: true,
        enum: ['text', 'email', 'textarea', 'number', 'boolean', 'date', 'datetime', 'dropdown', 'checkbox', 'file']
    },
    required: { type: Boolean, default: false }, 

    options: {
        type: Object,
        default: function () {
            return getDefaultOptions(this.type); 
        },
        validate: {
            validator: function (value) {
                return validateFieldOptions(this.type, value); 
            },
            message: 'Invalid options configuration.',
        }
    },
    isActive: { type: Boolean, default: true }, 
});


