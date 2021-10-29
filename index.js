#!/usr/bin/env node
const { getCode } = require('country-list');
const axios = require('axios');
const currentYear = new Date().getFullYear();
const countryListSrc = 'https://date.nager.at/api/v3/AvailableCountries';
const holidayListSrc = `https://date.nager.at/api/v3/PublicHolidays/${currentYear}/`;
const app = async () => {
    const args = process.argv.slice(2);
    if (args[0]) {
        const userCountry = args[0].toLowerCase().charAt(0).toUpperCase() + args[0].toLowerCase().slice(1);
        const getData = async() => {
            try {
                const list = await axios.get(countryListSrc);
                return list.data;
            } catch (error) {
                console.log(error);
            }
        }
        const getHolidays = async () => {
            try {
                const list = await axios.get(`${holidayListSrc}${getCode(userCountry)}`);
                return list.data;
            } catch (error) {
                console.log(error);
            }
        }
        const countryList = await getData();
        let match = false;
        for (let item of countryList) {
            if (item.name.includes(userCountry)) {
                match = true;
            }
        }
        if (match) {
            const holidayList = await getHolidays();
            for (let item of holidayList) {
                const date = new Date(item.date);
                console.log(`${item.name} : ${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`);
            }
        } else {
            console.log(`I'm afraid the country you entered does not exist`);
        }
    } else {
        console.log('Please enter a country as an argument');
    }
    
}
app();