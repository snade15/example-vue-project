<template>
    <div>
        <el-card class="box-card" id="main">
            <h1>
                Waar wil je een auto huren?
            </h1>
            <h3>
                Tijd én geld besparen? Wij vergelijken het aanbod van autoverhuurders, zodat jij dat niet hoeft te doen.
            </h3>

            <el-select
                class="location_select"
                v-model="location"
                filterable
                remote
                reserve-keyword
                placeholder="Voer stad, luchthaven of treinstation in"
                :remote-method="remote_search_method"
                :loading="loading_query_options">
                <el-option
                    v-for="item in query_options"
                    :key="item.locationDestinationId"
                    :label="make_item_label(item)"
                    :value="item.locationDestinationId">
                </el-option>
            </el-select>

            <el-date-picker
                class="period_select"
                v-model="rent_period"
                type="daterange"
                range-separator="t/m"
                start-placeholder="Start date"
                end-placeholder="End date">
            </el-date-picker>

            <el-button type="success" class="search_button" @click="get_quote">
                Huurauto zoeken
            </el-button>

        </el-card>

        <el-card v-for="quote in quotes" :key="quote.id" class="quote_card">
            <strong>Quote</strong>
                <el-input
                    placeholder="Please input"
                    :value="quote.id"
                    :disabled="true">
                </el-input>
        </el-card>
    </div>
</template>

<script>
const moment = require('moment');

export default {
    name: 'pages-main',
    data() {
        return {
            location: "",
            location_object: {},
            location_query: "",
            loading_query_options: false,
            query_options: [],

            rent_period: [
                new Date(),
                new Date(),
            ],

            quotes: [],
        }
    },
    watch: {
        location(value) {
            const self = this;

            let filtered_options = self.query_options.filter(
                option => option.locationDestinationId === value
            );

            self.location_object = filtered_options ? filtered_options[0] : {};
        }
    },
    methods: {
        make_item_label(item) {
            let parts = [];

            if (item.locationName) {
                parts.push(item.locationName);
            }

            if (item.cityName) {
                parts.push(item.cityName);
            }

            if (item.countryName) {
                parts.push(item.countryName);
            }

            return parts.join(", ");
        },
        remote_search_method(value) {
            const self = this;

            self.location_query = value;

            if (!value || value.length < 2) {
                return
            }

            let visit_sid = self.$cookie.get('sid');

            if (!visit_sid) {
                self.$emit('get_visit_sid', self.remote_search_method)
                return;
            }

            self.$http.get(
                "https://api-staging.easyterra.dev/product-type/cars/destinations/search",
                {
                    params: {
                        keyword: value
                    },
                    headers: {
                        'x-config-id': 4,
                        'x-visit-sid': visit_sid,
                    }
                }
            ).then(response => {
                let {data} = response;
                self.query_options = data;
            });
        },
        get_quote() {
            const self = this;

            if (!self.location) {
                return;
            }

            let visit_sid = self.$cookie.get('sid');

            if (!visit_sid) {
                self.$emit('get_visit_sid', self.get_quote)
                return;
            }

            let pickup_date_formatted = moment(self.rent_period[0]).format("YYYY-MM-DD HH:mm:ss");
            let dropoff_date_formatted = moment(self.rent_period[0]).format("YYYY-MM-DD HH:mm:ss");

            self.$http.post(
                "https://api-staging.easyterra.dev/quotes",
                {
                    currency: "EUR",
                    productType: "cars",
                    filters: {
                        version: "qe-1.0"
                    },
                    comparison: [],
                    order: {
                        field: "RATE_PRICE",
                        direction: "ASC",
                    },
                    inheritedFromQuoteSearchId: null,

                    pickupQuery: self.location_query,
                    pickupDate: pickup_date_formatted,
                    pickupCountry: self.location_object.countryId,
                    pickupCity: self.location_object.cityId,
                    pickupRegion: null,
                    pickupLocation: null,

                    dropoffQuery: self.location_query,
                    dropoffDate: dropoff_date_formatted,
                    dropoffCountry: self.location_object.countryId,
                    dropoffCity: self.location_object.cityId,
                    dropoffRegion: null,
                    dropoffLocation: null,

                },
                {
                    headers: {
                        'x-visit-sid': visit_sid,
                        'x-config-id': 4,
                        'content-type': 'application/json;charset=UTF-8',
                    }
                }
            ).then(response => {
                let {data} = response;
                self.quotes.push(data);
            });
        }
    }
}
</script>


<style scoped="scoped">

#main h3 {
    font-weight: normal;
}

.location_select {
    width: 100%;
}

.period_select {
    width: 100%;
    margin-top: 15px;
}

.search_button {
    margin-top: 15px;
    width: 100%;
    background-color: #39a537;
    font-size: 18px;
}

.quote_card{
    margin-top: 15px;
}

</style>
