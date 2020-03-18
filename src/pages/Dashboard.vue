<template>
  <div>
    <!-- <h3>Quantidade de Participantes: {{ totalParticipantes }}</h3> -->

    <v-select
      :items="traducaoPerg"
      label="Dados por Pergunta"
      v-model="pergunta"
      item-text="descricao"
      item-value="id"
    ></v-select>

    <!--Stats cards-->
    <div class="row">
      <div
        class="col-md-6 col-xl-2"
        v-for="(opcao, index) in cards"
        :key="opcao.id"
      >
        <stats-card>
          <div class="icon-big text-center" slot="header">
            <i>
              <img :src="icones[index].icone" :alt="opcao.descricao" />
  
            </i>
          </div>
          <div class="numbers" slot="content">
            <p>{{ opcao.descricao }}</p>
            {{ opcao.valor }}
          </div>
        </stats-card>
      </div>
    </div>

    <!--Charts-->
    <div class="row">
      <div class="col-12">
        <apexchart width="45%" :options="chartOptions" :series="series">
        </apexchart>
      </div>
    </div>
    <div id="id_legenda" class="legend">
      <ul>
        <li class="header">Legenda</li>
        <li class="treeview">
          <i class="list-group-item-inline promotor"></i>
          <span>Promotor</span>
	      </li>
        <li class="treeview">
          <i class="list-group-item-inline neutro"></i>
          <span>Neutro</span>
        <li class="treeview">
          <i class="list-group-item-inline detrator"></i>
          <span>Detrator</span>
	      </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { StatsCard } from "@/components/index";

const API_URL_LISTAR = process.env.VUE_APP_URL+"api/v4/frete/feedback/stats";

export default {
  components: {
    StatsCard
  },
  /**
   * Chart data used to render stats, charts. Should be replaced with server data
   */
  data() {
    return {
      totalParticipantes: 1000,
      pergunta: "",
      traducaoPerg:[
        {id:"", descricao:"Todos"},
        {id:"price", descricao:"Preço"},
        {id:"product_mix", descricao:"Mix Produto"},
        {id:"customer_service", descricao:"Atendimento ao Cliente"},
        {id:"delivery_speed", descricao:"Rapidez na Entrega"},
        {id:"pleasant_environment", descricao:"Ambiente Agradável"},
        {id:"sales_consultants", descricao:"Consultores de Vendas"},
        {id:"service_team", descricao:"Equipe de Serviço"},
        {id:"cash_team", descricao:"Equipe de Caixa"},
        {id:"delivery_team", descricao:"Equipe de Entrega"},
        {id:"customer_expectations", descricao:"Expectativas do Cliente"},
        {id:"new_purchases", descricao:"Novas Compras"},
        {id:"recommendation", descricao:"Recomendação"},
        
      ],
      traducaoOpc: 
         {"pessimo":"Péssimo", "insatisfeito":"Insatisfeito", "neutro":"Neutro", "bom":"Bom", "excelente":"Excelente"}
      ,
      chartOptions: {
        plotOptions: {
          pie: {
            customScale: 1,
            offsetX: 0,
            offsetY: 0,
            dataLabels: {
              minAngleToShowLabel: 1
          }, 
          }
        },
        title: {
          text: "Gráfico NPS"
        },
        chart: {
          type: "pie",
          width: 600
        },
        labels: [],

        dataLabels: {
          enabled: true,
          formatter: function(val) {
            return Math.round(val) + "%";
          }
        },
        legend: {
          show: false
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: "bottom"
              }
            }
          }
        ],
        fill: {
          colors: [
            "rgb(50,205,50)",
            "rgb(255,255,0)",
            "rgb(255,0,0)"
          ]
        }
      },
      series: [],
      icones: [
        {
          id: 1,
          icone: "/imagens/emogis-02.png"
            
        },
        {
          id: 2,
          icone:"/imagens/emogis-03.png"
          
            
        },
        {
          id: 3,
          icone:"/imagens/emogis-04.png"
          
            
        },
        {
          id: 4,
          icone:"imagens/emogis-05.png"
          
        },
        {
          id: 5,
          icone:"imagens/emogis-06.png"
           
        }
      ],
      cards: [],
      perguntas: [],
      perguntaList: {}
    };
  },

  methods: {
    updateCardsAndChart: function() {
      this.cards = [];
      var self = this;
      this.chartOptions.labels = [];
      this.series = [];

      let promotor = 0;
      let neutro = 0;
      let detrator = 0;

      if(this.pergunta == ""){
        Object.keys(this.perguntaList).forEach(function(item){
          let total = 0;
          Object.keys(self.perguntaList[item]).forEach(function(inner){
            total += self.perguntaList[item][inner];
          });
          if(item == "excelente" || item == "bom"){
            promotor += total;
          }else if(item == "neutro"){
            neutro += total;
          }else if(item == "pessimo" || item == "insatisfeito"){
            detrator += total;
          }
          self.cards.push({descricao: self.traducaoOpc[item], valor: total });
        });
      }else{
        Object.keys(this.perguntaList).forEach(function(item){
          let total = 0;
          Object.keys(self.perguntaList[item]).forEach(function(inner){
            if(inner == self.pergunta){
              total += self.perguntaList[item][inner];
              self.cards.push({descricao: self.traducaoOpc[item], valor: total });
            }
          });
          if(item == "excelente" || item == "bom"){
              promotor += total;
            }else if(item == "neutro"){
              neutro += total;
            }else if(item == "pessimo" || item == "insatisfeito"){
              detrator += total;
            }
        });
      }
      
      this.chartOptions.labels.push("promotor");
      this.chartOptions.labels.push("neutro");
      this.chartOptions.labels.push("detrator");
      this.series.push(promotor);
      this.series.push(neutro);
      this.series.push(detrator);
    },
    // loadQuestions: function(){
    //   var self = this;
    //   self.perguntas.push("");
    //   Object.keys(self.perguntaList).forEach(function(item){
    //     let total = 0;
    //     Object.keys(self.perguntaList[item]).forEach(function(inner){
    //       if(!self.perguntas.includes(inner)){
    //         self.perguntas.push(inner);
    //       }
    //     });
    //   });
    // },
    initialize() {
      var self = this;
      this.axios.get(API_URL_LISTAR, {}).then(function(resultado) {
        self.perguntaList = resultado.data.result;
        console.log(resultado)
        self.updateCardsAndChart();
        // self.loadQuestions();
      });
    }
  },

  watch: {
    pergunta: function(value) {
      this.updateCardsAndChart();
    }
  },
  mounted() {
    this.initialize();
  }
};
</script>
<style>
ul{
  list-style-type: none;
}
.list-group-item-inline {
    float: left;
    width: 20px;
    height: 20px;
    margin-right: 5px;
    /* border-radius: 3px; */
    border-radius: 15px;
    border: 1px solid none;
}
.detrator{
    background-color: rgba(255,0,0) !important;
}
.promotor {
    background-color: rgba(50,205,50) !important;
}
.neutro  {
    background-color: rgba(255,255,0) !important;
}
</style>
