<template>
  <q-page class="flex flex-center">

  </q-page>
</template>

<script>
const PARAMS_KEY = 'Ina_$ecret_k3y_2023';

import Vue from 'vue';
import VueCryptojs from 'vue-cryptojs';

export default {
  name: 'Principal',
  data() {
    return {
      host: process.env.API_URL,

    }
  },
  created() {
    Vue.use(VueCryptojs);
    this.recibirParametros();
  },
  mounted() {
      this.recibirParametros();
  },


  methods: {
    recibirParametros: function () {
      this.$q.loading.show();
      //let parametroUrl = this.$route.query.p;


      // let parametroValido = this.validarParametro(parametroUrl);
      let parametroValido = true;

      //let idUsuario = this.$route.query.u;
      if ( parametroValido ) {
        let objeto = this.obtenerObjetoParametro(parametroUrl);
        console.log(JSON.stringify(objeto, null, 2));
        //let idUsuario = objeto.u;
        //let idSistema = objeto.s;
        let idUsuario = 3089;
        let idSistema = 126;

        let datos = new FormData();
        datos.append('action', 'LOGIN');
        datos.append('valores', ''.concat(idUsuario, '|', 0, '|', 0));

        this.$axios
          .post(`${this.host}/SConsulta`, datos, this.requestMultipartConfig)
          .then(response => {
            let resultados = response.data;
            if (resultados.length>0){
              let datosUsuario = resultados[0];
              console.log("imprimir data usuario: ", datosUsuario);
             

               this.$q.localStorage.set('mda-idUsuario', datosUsuario.id);
               this.$q.localStorage.set('mda-idPersonal', datosUsuario.idPersonal);
               this.$q.localStorage.set('mda-nombreUsuario', datosUsuario.nombreUsuario);
               this.$q.localStorage.set('mda-nombreCompleto', datosUsuario.nombreCompleto);
               this.$q.localStorage.set('mda-idPerfil', datosUsuario.idPerfil);
               this.$q.localStorage.set('mda-nombreUnidad', datosUsuario.unidadNombre);
               this.$q.localStorage.set('mda-idUnidad', datosUsuario.unidad);
               //this.$q.localStorage.set('mda-idSistema', datosUsuario.unidad);

               this.$router.push({path: '/inicio'});
            }
          })
          .catch((e) => {
          })
          .finally(() => {
            this.$q.loading.hide();
          });
      } else {
        //window.location.href = 'https://srvapp01.inabif.gob.pe:8443/seguridad/SPrincipal';
      }
    },
    obtenerObjetoParametro: function (parametro) {
      let parametroAes = decodeURIComponent(parametro);

      try {
        let objetoTexto = this.$CryptoJS.AES.decrypt(parametroAes, PARAMS_KEY).toString(this.$CryptoJS.enc.Utf8);

        let objeto = JSON.parse(objetoTexto);
        return objeto;
      } catch (e) {
        return {};
      }
    },
    validarParametro: function (parametro) {
      let objeto = this.obtenerObjetoParametro(parametro);

      let idSistema = objeto.s;
      let idUsuario = objeto.u;
      let fecha = new Date();
      let tiempoActual = fecha.getTime();
      let tiempoRedireccion = objeto.t;
      let diferencia = tiempoActual - tiempoRedireccion;

      return (idSistema!=null && idUsuario!=null && diferencia<=60000);
    },
  }
}
</script>
