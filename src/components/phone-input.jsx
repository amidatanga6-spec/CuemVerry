import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import intlTelInput from 'intl-tel-input';
import 'intl-tel-input/build/css/intlTelInput.css';
import './phone-input.css';

const PhoneInput = ({ value, onChange, error, id, name }) => {
    const inputRef = useRef(null);
    const itiRef = useRef(null);

    useEffect(() => {
        const inputElement = inputRef.current;
        
        if (inputElement && !itiRef.current) {
            itiRef.current = intlTelInput(inputElement, {
                initialCountry: 'auto',
                geoIpLookup: (callback) => {
                    fetch('https://ipapi.co/json/')
                        .then((res) => res.json())
                        .then((data) => callback(data.country_code))
                        .catch(() => callback('vn'));
                },
                utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input@25.13.2/build/js/utils.js',
                preferredCountries: ['vn', 'us', 'gb'],
                separateDialCode: true,
                nationalMode: true,
                formatOnDisplay: true,
                autoPlaceholder: 'aggressive',
                placeholderNumberType: 'MOBILE',
                customContainer: 'w-100',
                strictMode: false
            });

            const handleCountryChange = () => {
                if (itiRef.current) {
                    const fullNumber = itiRef.current.getNumber();
                    onChange(fullNumber);
                }
            };

            inputElement.addEventListener('countrychange', handleCountryChange);

            return () => {
                if (inputElement) {
                    inputElement.removeEventListener('countrychange', handleCountryChange);
                }
                if (itiRef.current) {
                    itiRef.current.destroy();
                    itiRef.current = null;
                }
            };
        }
    }, [onChange]);

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        if (itiRef.current) {
            const fullNumber = itiRef.current.getNumber();
            onChange(fullNumber || inputValue);
        } else {
            onChange(inputValue);
        }
    };

    return (
        <div className="intl-tel-input-wrapper">
            <input
                ref={inputRef}
                type="tel"
                id={id}
                name={name}
                className={`form-control ${error ? 'is-invalid' : ''}`}
                value={value}
                onChange={handleInputChange}
                required
            />
        </div>
    );
};

PhoneInput.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.bool,
    id: PropTypes.string,
    name: PropTypes.string
};

export default PhoneInput;
