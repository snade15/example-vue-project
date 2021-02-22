<template>
    <div id="app">
        <div class="logo">
            <img alt="Vue logo" src="./assets/logo.png">
        </div>
        <el-row type="flex" justify="center">
            <el-col :span="8">
                <router-view
                    @get_visit_sid="make_visit"
                ></router-view>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: 'App',
    components: {

    },
    methods: {
        make_visit(callback=null){
            const self = this;
            self.$http.post(
                "https://api-staging.easyterra.dev/visits",
                {
                    config: 4,
                    currency: null,
                    landingPage: "https://www.easyterra.nl/",
                    referer: null,
                    affiliate: null,
                    gclid: null,
                    ipAddress: "0.0.0.0",
                    discounts: null,
                    domainCookieVisitSid: null,
                },
                {
                    headers: {
                        'x-config-id': 4,
                        'content-type': 'application/json;charset=UTF-8',
                    }
                }
            ).then(response => {
                let {data} = response;
                self.$cookie.set('sid', data.sid)
                if(callback){
                    callback();
                }
            });
        }
    },
    created(){
        const self = this;

        let visit_sid = self.$cookie.get('sid')
        if(!visit_sid){
            self.make_visit();
        }
    }
}
</script>

<style>
    .logo{
        text-align: center;
        margin: 30px;
    }
</style>
