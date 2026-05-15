<template>
    <q-layout view="lHh Lpr lFf">
        <q-header>
            <q-toolbar>
                <q-btn
                    flat
                    dense
                    round
                    icon="menu"
                    aria-label="Menu"
                    @click="leftDrawerOpen = !leftDrawerOpen"
                />

                <q-toolbar-title>
                    <img style="width: 360px;" alt="Logo INABIF"
                         src="https://srvapp02.inabif.gob.pe/intranet/Img/LOGO_INABIF_2020.png">
                </q-toolbar-title>

                <div class="row text-right">
                    <div class="col-10">
                        <strong>{{ this.$q.localStorage.getItem('sgs-nombreCompleto') }}</strong>
                        <br>
                        <span style="font-size: 85%;">{{ this.$q.localStorage.getItem('sgs-nombreUnidad') }}</span>
                        <br>
<!--                        <span style="font-size: 85%;">{{ this.$q.localStorage.getItem('sgs-idUsuario') }}</span>-->
<!--                        <br>-->
<!--                        <span style="font-size: 85%;">{{ this.$q.localStorage.getItem('sgs-numeroDocumento') }}</span>-->
                    </div>
                    <div class="col-2">
                        <q-btn icon="exit_to_app" @click="salir" flat round

                               style="font-size: 18px; transform: scaleX(-1);">
                            <q-tooltip>REGRESAR</q-tooltip>
                        </q-btn>
                    </div>
                </div>
            </q-toolbar>
        </q-header>

        <q-drawer
            v-model="leftDrawerOpen"
            show-if-above
            bordered>
            <q-list>

<!--                <q-item clickable to="/inicio">-->
<!--                    <q-item-section avatar>-->
<!--                        <q-icon name="desktop_windows"/>-->
<!--                    </q-item-section>-->
<!--                    <q-item-section>-->
<!--                        <q-item-label>Inicio</q-item-label>-->
<!--                    </q-item-section>-->
<!--                </q-item>-->

                <!-- MÓDULOS -->
                <div v-for="modulo in menuOrdenado" :key="modulo.descripcion">

                    <!-- TÍTULO DEL MÓDULO -->
                    <q-item-label header class="text-bold">
                        {{ modulo.descripcion }}
                    </q-item-label>

                    <!-- MENÚS -->
                    <div v-for="menu in modulo.subitems" :key="menu.descripcion">

                        <!-- MENÚ CON HIJOS -->
                        <q-expansion-item
                            v-if="menu.subitems.length"
                            :label="menu.descripcion"
                            :icon="menu.icono"
                            dense
                            :disable="menu.flgDeshabilitado === 1"
                        >


                            <q-item
                                v-for="item in menu.subitems"
                                :key="item.descripcion"
                                clickable
                                dense
                                :disable="item.flgDeshabilitado === 1"
                                @click="irA(item.enlace)"
                            >
                                <q-item-section avatar>
                                    <q-icon/>
                                </q-item-section>
                                <q-item-section>
                                    <q-item-label>{{ item.descripcion }}</q-item-label>
                                </q-item-section>
                            </q-item>
                        </q-expansion-item>

                        <!-- MENÚ SIMPLE -->
                        <q-item
                            v-else
                            clickable
                            dense
                            :disable="menu.flgDeshabilitado === 1"
                            @click="irA(menu.enlace)"
                        >
                            <q-item-section avatar>
                                <q-icon :name="menu.icono"/>
                            </q-item-section>
                            <q-item-section>
                                <q-item-label>{{ menu.descripcion }}</q-item-label>
                            </q-item-section>
                        </q-item>

                    </div>
                </div>

            </q-list>
        </q-drawer>

        <q-page-container>
            <router-view/>
        </q-page-container>
    </q-layout>
</template>

<script>

export default {
    name: 'MainLayout',
    data() {
        return {
            host: process.env.API_RUTA,

            menuBackend: [],
            leftDrawerOpen: false,
            menuItems: [
                {
                    orden: 10, icono: 'support_agent', descripcion: 'Mesa de ayuda',
                    subitems: [
                        {orden: 10, enlace: 'tickets', descripcion: 'Gestión de tickets'},
                        {orden: 20, enlace: 'misTickets', descripcion: 'Tickets asignados'},
                    ]
                },
                {
                    orden: 20, icono: 'phone_android', descripcion: 'Equipos móviles',
                    subitems: [
                        {orden: 10, enlace: 'equipos', descripcion: 'Gestión de equipos'},
                    ]
                },
            ],
        }
    },
    async created() {
        await this.recibirParametros();
        await this.obtenerOpcionesMenu();

    },

    methods: {
        salir: function () {
            let keys = Object.keys(this.$q.localStorage.getAll());
            let systemKeys = keys.filter(k => k.startsWith('sgs-'));
            for (let i = 0; i < systemKeys.length; i++) {
                this.$q.localStorage.remove(systemKeys[i]);
            }
            window.location.href = 'https://srvapp01.inabif.gob.pe:8443/seguridad/SPrincipal';
        },
        async obtenerOpcionesMenu() {


            // alert(this.$q.localStorage.getItem('sgs-idUsuario'));

            // https://srvapp01.inabif.gob.pe:8443/SRH/SPermiso?action=itemsMenu2&u=7496&s=126

            const host = "https://srvapp01.inabif.gob.pe:8443/SRH/";

            const request = await this.$axios.get(`${host}/SPermiso`, {
                params: {
                    action: "itemsMenu2",
                    u: this.$q.localStorage.getItem('sgs-idUsuario'),
                    s: 166
                }
            });

            // 🔥 ELIMINAR INICIO
            this.menuBackend = request.data.map(modulo => ({
                ...modulo,
                subitems: modulo.subitems.filter(
                    item => item.descripcion !== 'INICIO'
                )
            }));

            console.log("traer menus: ", request);
        },
        irA(ruta) {
            if (ruta && ruta !== '#') {
                this.$router.push('/' + ruta)
            }
        },

        getParamFromHash: function (name) {
            const hash = window.location.hash || ''
            const qIndex = hash.indexOf('?')
            if (qIndex === -1) return null

            const queryString = hash.slice(qIndex + 1)
            const params = new URLSearchParams(queryString)
            return params.get(name)
        },
        parseJwt: function (token) {
            if (!token || typeof token !== 'string') return null

            const parts = token.split('.')
            if (parts.length !== 3) return null

            try {
                const base64Url = parts[1]
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
                const jsonPayload = decodeURIComponent(
                    atob(base64)
                        .split('')
                        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                        .join('')
                )
                return JSON.parse(jsonPayload)
            } catch (e) {
                console.error('JWT inválido', e)
                return null
            }
        },
        async recibirParametros() {

            // 0️⃣ Si ya hay sesión activa, redirigir
           if (this.$q.localStorage.has('sgs-idUsuario')) {
                this.$router.push({path: '/inicio'})
                return
            }

            // 1️⃣ Obtener token desde query o hash
            let token = this.$route?.query?.p
            if (!token) token = this.getParamFromHash('p')

            if (!token) {
                this.$q.notify({type: 'negative', message: 'No llegó el parámetro p'})
                return
            }

            // 2️⃣ Decodificar JWT
            const payload = this.parseJwt(token)
            if (!payload) {
                this.$q.notify({type: 'negative', message: 'Token inválido'})
                return
            }

            const {idUsuario, idSistema, exp} = payload

            // 3️⃣ Validar estructura mínima
            if (!idUsuario || !idSistema) {
                this.$q.notify({type: 'negative', message: 'Token incompleto'})
                return
            }

            // 4️⃣ Validar expiración (si viene en el token)
            if (exp) {
                const now = Math.floor(Date.now() / 1000)
                if (exp < now) {
                    this.$q.notify({type: 'negative', message: 'Token expirado'})
                    return
                }
            }

            // 5️⃣ Llamar al endpoint SPermiso
            try {
                const {data} = await this.$axios.get(
                    `${this.host}/SPermiso`,
                    {
                        params: {
                            action: 'login',
                            tipo: 'PERFIL_POR_USUARIO_Y_SISTEMA',
                            u: idUsuario,
                            s: idSistema
                        }
                    }
                )

                // 6️⃣ Si no está autorizado → limpiar y salir
                if (!data) {
                    const keys = Object.keys(this.$q.localStorage.getAll())
                    keys
                        .filter(k => k.startsWith('sgs-') || k.startsWith('sg-'))
                        .forEach(k => this.$q.localStorage.remove(k))

                    this.$q.notify({
                        type: 'negative',
                        message: 'NO ESTÁ AUTORIZADO A INGRESAR'
                    })

                    window.location.href = 'https://srvapp01.inabif.gob.pe:8443/intranet'
                    return
                }

                // 7️⃣ Guardar datos de sesión (equivalente al flujo antiguo)
                this.$q.localStorage.set('sgs-idUsuario', data.idUsuario)
                this.$q.localStorage.set('sgs-idPerfil', data.idPerfil)
                this.$q.localStorage.set('sgs-nombreUsuario', data.nombreUsuario)
                this.$q.localStorage.set('sgs-nombreCompleto', data.nombresApellidos)
                this.$q.localStorage.set('sgs-nombreUnidad', data.unidadOrganica)
                this.$q.localStorage.set('sgs-idPersonal', data.idPersonal)
                this.$q.localStorage.set('sgs-numeroDocumento', data.perNroDocumento)


                // 8️⃣ Redirigir
                this.$router.push({path: '/inicio'})

            } catch (error) {
                console.error(error)
                this.$q.notify({
                    type: 'negative',
                    message: 'No se pudo validar el usuario'
                })
            }
        }

    },

    computed: {
        menuOrdenado() {
            return [...this.menuBackend]
                .sort((a, b) => a.orden - b.orden)
                .map(modulo => ({
                    ...modulo,
                    subitems: modulo.subitems
                        .sort((a, b) => a.orden - b.orden)
                        .map(menu => ({
                            ...menu,
                            subitems: menu.subitems.sort((a, b) => a.orden - b.orden)
                        }))
                }))
        }
    },
}
</script>
