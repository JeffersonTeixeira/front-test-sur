import React, { useState } from 'react';
import { IMaskInput } from 'react-imask';
import axios from 'axios';
const CepInput = (props) => {

    const [lastSearch, setLastSearch] = useState('');

    const search = (cep) => {
        if (lastSearch != cep)
            axios.get('https://viacep.com.br/ws/' + cep + '/json')
                .then((response) => {
                    props.responsecep(response.data);
                    setLastSearch(cep);
                })
                .catch(error => console.error(error));
    }

    return (
        <IMaskInput
            {...props}
            mask={"00000-000"}
            onKeyUp={e => {
                let cep = e.target.value.replace(/\D/g, '');
                if (cep.length === 8) {
                    search(cep);
                }
            }}
        >
        </IMaskInput>
    );
};

export default CepInput;