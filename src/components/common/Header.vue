
<template>
    <div class="header">
        <nav class="navbar navbar-expand-lg bg-body-white">
            <div class="container-fluid">
                <RouterLink class="navbar-brand" to="/">
                    <img src="../../assets/group-2420.svg" class="mx-xl-5" alt="">
                </RouterLink>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-xl-0">
                        <li class="nav-item">
                            <RouterLink class="nav-link" to="/">
                                <img id="svglinks" src="../../assets/Home.svg" height="20" alt="" />
                                <span class="mx-lg-1">Home</span>
                            </RouterLink>
                        </li>
                        <li class="nav-item mx-xl-1">
                            <RouterLink class="nav-link mx-lg-1" to="/sentinel">
                            <i class="fa-solid fa-location-dot"></i>
                                <!-- <img id="svglinks" src="../../assets/group-2456.svg" height="20" alt="" class="mr-4" /> -->
                                <span class="mx-lg-1">Sentinel</span>
                            </RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink class="nav-link" to="/sessions">
                                <img id="svglinks" src="../../assets/group-24551.svg" height="20" alt="" />
                                <span class="mx-lg-1">Sessions</span>
                            </RouterLink>
                        </li>
                        <li class="nav-item mx-xl-1">
                            <RouterLink class="nav-link mx-xl-1" to="/monitor">
                                <i class="fa-regular fa-eye"></i>
                                <span class="mx-lg-1">Profile</span>
                            </RouterLink>
                        </li>
                        <li class="nav-item mx-xl-1">
                            <RouterLink class="nav-link mx-lg-1 mx-xl-1" to="/groups">
                                <img id="svglinks" src="../../assets/group-25271.svg" height="20" alt="" />
                                <span class="mx-lg-1">Groups</span>
                            </RouterLink>
                        </li>
                        <li class="nav-item mx-xl-1">
                            <RouterLink class="nav-link mx-lg-1 mx-xl-1" to="/alerts">
                                <i class="fa-regular fa-bell"></i>
                                <span class="mx-lg-1">Alerts</span>
                            </RouterLink>
                        </li>
                        <li class="nav-item mx-xl-1">
                            <RouterLink class="nav-link mx-lg-1 mx-xl-1" to="/reports">
                                <i class="fa-solid fa-chart-gantt"></i>
                                <span class="mx-lg-1">Reports</span>
                            </RouterLink>
                        </li>
                        <li class="nav-item mx-xl-1">
                            <RouterLink class="nav-link mx-lg-1 mx-xl-1" to="/traceroute">
                                <i class="fa-solid fa-route"></i>
                                <span class="mx-lg-1">Traceroute</span>
                            </RouterLink>
                        </li>
                    </ul>
                    <!-- <div class="search-container">
                        <button class="search-button">All</button>
                        <input type="text" class="search-bar" />
                        <img src="../../assets/search.svg" height="20" alt="" class="searchIcon" />
                    </div>
                    <button class="btnn1 mx-lg-1 mx-xl-2">
                        <img src="../../assets/group-17921.svg" height="40" alt="" />
                    </button> -->
                    <button class="btnn">
                        <i class="fa-regular fa-bell" style="color: #e4eaee"></i>
                    </button>
                    <RouterLink to="/dashboard" class="btnn mx-lg-1 mx-xl-2">
                        <i class="fa-solid fa-users text-secondary"></i>
                    </RouterLink>
                    <div class="btn-group">
                        <button class="btnn text-decoration-none text-secondary" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            {{ userData.user.name.substring(0, 2) }}</button>
                        <ul class="dropdown-menu dropdown-menu-end dropdown-menu-lg-starts">
                            <li>
                                <h6 class="dropdown-header"><i class="fa-regular fa-user"></i>
                                    {{ userData.user.name }}</h6>
                            </li>
                            <li>
                                <button class="dropdown-item" @click="logoutUser"><i class="fa-solid fa-right-from-bracket"></i> Logout</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    </div>
    <RouterView />
</template>
<script>
import { RouterLink, RouterView } from 'vue-router';
import { useAuth0 } from '@auth0/auth0-vue';

export default {
    name: 'Header',
    setup() {
        const {logout } = useAuth0()
        return {
            logout: () => {
                logout()
            },
        }
    },
    data() {
        return {

        }
    },
    components: {

    },
    computed: {
        userData() {
            return this.$store.getters.getUserData;
        },
    },
    mounted() {
    },
    methods: {
        logoutUser() {
            // Call the logout action from the Vuex store
            this.$store.dispatch('logout');
            this.logout()
        },
    }
}
</script>

<style>
a {
    color: var(--dark_color);
}

.nav-link {
    font-size: 20px;
    color: #404040;
    display: flex;
}

.nav-link:hover {
    color: var(--primary_color);
}

a.router-link-exact-active {
    color: var(--primary_color);
}

.searchIcon {
    width: 20px;
    /* Adjust the width as needed */
    height: 20px;
    /* Adjust the height as needed */
    margin-left: 10px;
}

.btnn {
    border: 1px solid var(--nav-color);
    border-radius: 10px;
    padding: 8px 12px;
    color: var(--blue_color);
    background-color: var(--white_color);
}

.btnn:hover {
    border: 1px solid var(--primary_color_Hover);
}

.btnn1 {
    background-color: transparent;
    border: none;
    outline: none;
}

.search-container {
    display: flex;
    align-items: center;
    position: relative;
}

.search-container .searchIcon {
    position: absolute;
    right: 9px;
    bottom: 9px;
}

/* Style the search button */
.search-button {
    padding: 9px 25px;
    background-color: var(--primary_color);
    border: 0;
    color: #fff;
    cursor: pointer;
    border-radius: 10px 0 0 10px;
}

/* Style the search bar */
.search-bar {
    padding: 9px;
    border: 0;
    border-radius: 0 10px 10px 0;
    flex-grow: 1;
    background-color: #f3f3f3;
}

.search-bar:active,
.search-bar:focus {
    border: 1px solid var(--primary_color);
    outline: none;
}

.fa-magnifying-glass {
    position: absolute;
    /* top: 10px; */
    right: 230px;
    color: darkgrey;
}

.header {
    background-color: white;
    box-shadow: 2px 3px 2px #d2d1d1;
}

.nav-item {
    cursor: pointer;
}

@media screen and (max-width: 1539px) {
    .nav-link {
        font-size: 15px !important;
    }
}

@media screen and (max-width: 1370px) {
    .nav-link {
        font-size: 12px !important;
    }

    .search-button {
        padding: 6px 17px;
    }

    /* Style the search bar */
    .search-bar {
        padding: 5px;
    }
}

@media screen and (max-width: 1280px) {
    .nav-link {
        font-size: 13px !important;
    }

    .search-button {
        padding: 6px 17px;
    }

    /* Style the search bar */
    .search-bar {
        padding: 5px;
    }

    .fa-magnifying-glass {
        position: absolute;
        /* top: 10px; */
        right: 200px;
    }
}
</style>