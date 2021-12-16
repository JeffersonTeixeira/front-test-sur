import React, { useState } from 'react';
import InputMask from 'react-input-mask';
import axios from 'axios';
const CepInput = ({ className, ...props }) => {
    const [mask, setMask] = useState("99999-999");

    const search = (cep) => {
        axios.get('https://viacep.com.br/ws/' + cep + '/json')
            .then((response) => {
                props.responsecep(response.data);
            })
            .catch(error => console.error(error));
    }

    return (
        <InputMask
            {...props}
            mask={mask}
            onKeyUp={(e, a) => {
                let cep = e.target.value.replace(/\D/g, '');
                if (cep.length === 8) {
                    search(cep);
                }
            }}
        >
            {inputProps => <input {...inputProps} className={className} readOnly={props.readOnly} type="tel" />}
        </InputMask>
    );
};

export default CepInput;