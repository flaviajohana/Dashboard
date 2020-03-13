<template>
  <div>
    <h3>Quantidade de Participantes: {{ totalParticipantes }}</h3>

    <div class="row">
      <v-select 
      :items="perguntaList" 
      label="Perguntas"  
      v-model="pergunta"
      item-text="descricao"></v-select>
    </div>

    <!--Stats cards-->
    <div class="row">
      
      <div
        class="col-md-6 col-xl-2"
        v-for="opcao in listaOpcoes"
        :key="opcao.descricao"
      >
        <stats-card>
          <div
            class="icon-big text-center"
            slot="header"
          >
          <i><img v-bind:src="opcao.icone" alt=""></i>
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
        <chart-card
          title="Estatísticas"
          sub-title="Por opção na pesquisa"
          :chart-data="preferencesChart.data"
          chart-type="Pie"
        >
        </chart-card>
      </div>
    </div>
  </div>
</template>
<script>

import { StatsCard, ChartCard } from "@/components/index";
import Chartist from "chartist";

// const API_URL_LISTAR = "http://www.mocky.io/v2/5e6b0b282d00007a008e831d";

export default {
  components: {
    StatsCard,
    ChartCard
  },
  /**
   * Chart data used to render stats, charts. Should be replaced with server data
   */
  data() {
    return {
      totalParticipantes: 100,
      pergunta:'',
      listaOpcoes: [ 
            {"descricao":"Excelente", "valor": 150, "porcentagem":25, icone:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAAE70lEQVRoge2ay29XRRTHP8Wf7Q9B4NdSiitEfIFYGhdKxMpKLUGTSqIJijsMRsMj6Eoj9m8waWKiK03Y+kgMAaO1Yg3Viq/E2oK4EEhUtGqlQiqMi3MmM/3lPuY+uGjCN5mc5M653zlzZ+bMmTMXruC/hZYSudqBe4ENwBpgFbAMWKD1Z4GfgBPAt8DHwEfAVIk25EYdeAI4BFwATMbyD3AQ2Aa0VWw7APOBZ4HTnlHngA+AF4F+YDXQAK7W0tBn/cA+YEjfse+fAvYiH6cSbAa+9wz4DNgOLM7BtQR4Ehjz+I4Dm0qxNAZ14BWvwc+B+0vk7wO+8PgHuQSjsxwx3CCLdidwVdmNKOduYAY32l1lka9EhtsA48DasogT0A1MaJvH1IZC6PQIPwWWFiXMgAbiog2yJpfnJarjptMnuP2gSiwAjuCmWa41Yxf2OLLZXS504GbFYNaXN+MWdhVrIg3dOAfQF/rSfNw+sTNGZz2wHzgJnFe5H7grg3FZOfbgFn/QFHsOt09EudgXgItEhxwXgOcD2sjDUQO+VJ09aQ3UcWFH1Gb3oNbNAi8BK5DwYwUwoM+N6sWhCMcmrTtJSmy2DechojCp9U/H1D+j9RMJbRThaMF50scS2uCQKm2PqR9D3OG8mPp5Wj+W0EZRjh1q44G4BtqRsPoc+QLAqtBAnMMsnp3+V9mILO4R4I9KTcuGKWTEashBDpjbkQ0qP6zOptwYUtlrH/gdWa3yq8rMyQ9r4632gd+Rm1Qeq8yc/JhUeXNU5RnEG3QEEI2Q/XweWg4HtL9UdX+Jqjyvla0BRP5Zu+wyE9B+Gy5PAMT78jT8rnItskmVUbqbuDPB78hfKhcGvGfdc+7DTgQsV0hHFqn80z7wO/KrypAz8imV1wXohsJ25HSA7jKVv9kHfkest4r0BE34WmWZZ5XbVYa4/1tUWu81pyPjKtcFENnG7gjQDYXl+iZA166n76Iq+xFPMBRV2YQ1qjuFhOBF0YqsDYPbmJMwrLoPRVU2cEHjkgAyG47fF2JpCh5Qrsgv3IR2XNBoF/2cqTUFvI/46EcCCN9SuSXE0hRYjjcDdB9FRvA9PK/VjMeRL5N0nrBYhxxXpymWZelQjou4BR+HFuCo2rg1SbENOUYaZLjT8K7qDgToxmFAOd4J0LXH5B8JuIbYq8pHSc/v3q2608jFTlas0neNciWhhnhLA+wKIa/jcr27A/RfV90RsiW2a0gG0yhHGuwHniDDpZDNVszgfHYcFgE/eAbVAvhrwBv6zgk87xODHuBv4rM7iRjEfYG00H49EqsZ4G2S3XcDWQ92St6Zwt2JRB0GeDnV6gjUkbSQQc7IaUnsjUi8ZpBLz32IZ7tGS48++1l1zuAdVWOwEBhV/VEK3DN24b7GEdJH5gbEv6edOQ6SfufRievEJC5QzI2VuM5MEBaL9QKvITv1WS3jwKvAPQHv93htTgLXZzU6Dl24aTaD5F5DFnVW1BDvZBf2KCWMRDPqOAdgkIRyWbevLchVht0n7MK+pHfvfbhhN0gudgfijbKiHXgKF3bYqVTmbXEi6sj0suGMQSLSYSTD/jBwG+IcWrV0IAexLaozjEt42LBjF5fpD4g2JCt+ADkCZM2YzCLx2lYKdqDMn2oWI7nYXuRwdCPiQq/V+mlkDzmOeLPDyKjEhuJX8H/Gv2h1p/5GpHF/AAAAAElFTkSuQmCC"},
            {"descricao":"Bom", "valor": 100, "porcentagem":50, icone:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAAEaklEQVRoge2az3MVRRDHPw9C3it+BN4LkQMXBAoxUBGu+OsiErGgAhdAr1BykVCc9IB6DIoXKf0H/A8sIOUFSPFDUMKPE/kBeNAgFSUHxUAqVC2H7qmZwL7d2d15L9HiW7U1r2a6e3r29fT0dC+8wNxCKaCsNuBt4A1gPbAOqAFLdPwfYAIYAYaAC8A57Z91lIG9QD8wDUQZn2ngNLAHaG2y7gBUgF7gd0epx8AZ4CjQA7wKVIEF+lS1rwf4DDirPIb/N+CQym4KtgGjjgK/APuBpTlkLQMOAFcdeSPAu0E0rYMK8K0z4WDgCbuB6478E4jpBsUK5M1HwL/Ax8D80JOozF5gUue6ArwUSvgqrCndAjaGEpyALmAYa2qrigrscAT+DCwvKjADqoiLjoDbiFXkQgVrTpeARSG0y4hFwGWsmeXaM99hzakWTLXsaMdaxYmszO9hN3Yz9kQaurAOYJsvUwWxyQjxTnMFhxGdRvE8NI9gz4lGuNi8aAFuILodTiMuY8OOrY3VKxe2I7rdI+Vf+RAbdsxFlBBLiYAPkgh/VKL9TVAqLz5CdOyvR1AFniARqU8A2AocQ/7mMaCPbKF4Xv4qMIVcAZbFEfQgKz3jqUgfz98v+jx5i/KfU/qdcYPHdfCop7CxGEXGPHmL8n+h9F+ZjnnOYKe2NzMo8yyiArxZ+I2O602Hu5C12o56Cvves68R/CParosb/At5I+2ewloRmx4j/2bPy79cdf0zbnBKB2clCZARZWyeAJhpWv9puAt5qO3i2VAkI9q0/dt0uAt5oG3um1gTYe7xE6bDXYjxVrGeYI7hFW2N95qxkFvavpYg4CJy5WxLoCmKNiRovZBA06XtUNygCVHOJggwkWc/jfFuZWzgOphAN6A0O+IG3aAxNhgD1iC+OwJ+ABbm0zcWC4GTKnscWF2HroYNGutahnkbBxIm3Iw4BpPZWJlZ5eexEkk3RcjBnGTeB5XudJJAc7G6mjJxJ/Cr0j4A9vnpW3fOCZV1F0l010MJuKa0iXNWsFFpWrZiBbJXTOR6EXjHQ3GDrcBPDv8p0tOj72Mz96k5LpN8uEZ68qGE3NjMvjFZwePIi+hECj1L9Hc38DVwx6EfR26kaUWnFiTqjZDyQyrcdFCvD4Mq+ilw31Ew7fkD+AT/SMK84GEyZBxNgm4S67N9MA94HfgSOI8s7LE+97XvGLCFbHHeJuCR6pS5lGFqIcP4h/aNQAe2GvBNHgFuEvsys5PEXoy4+EJJbJC3MYQtK3SE0M4TNcQTFi4rGLyM/WuHST6sQmGTM2eQQo+BW3qbRHKvLaGEO2hBvJPZ2EFLbwbPFkNvIN4tBErIYWfOCbOxgxdDXXQzszw9iByK1RyyakjsZMKOppSnXVQQ83I/GJhCwuvPgV3ABsRtt+rTjhSNdivNADbh4X4w0NB/oR7KSFa8H7kC+J7q5plGYqx9FFxAyI9qlgJvAW8iEexaxF27H9WMI650CDnlB3ASCC/wf8JTsm1kXg/KGNAAAAAASUVORK5CYII="},
            {"descricao":"Neutro", "valor": 60, "porcentagem":2, icone:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAAD3klEQVRoge3az29VRRQH8E+19pVYpS0tLCXxJ2pqWBt/xEShakx1gRG2RNyAFdeoyxpdofEf8G8QQzQoPzSiENRNf8BO68IfxAgiRM1zMXOd2/rad999993WhG9yc5I7c86cuTNz5sx3LtexvtBXoa0RPIIHcS9ux2bcjL9xCRexgDmcwnH8VqEPpdHAHhzFX2h2+PyJI3geAzX7DjbgIBZzTl3FMRzCFLYJo3RTdHJEGKkpvIZPok6m/x32Cx+nFkziQs6Br7AXG0vYGsaLOJuzt4DHK/F0BQzivVyDZ/FEhfZ34lzO/mE9GJ0tOBMb+F2YAjdW3Ui0+TKuxLa+wHhVxrfifDQ8i/urMrwKJjAf25zHbd0aHBdCZRNfYqxbgx1gFJ/Fti8Is6IUBqXp9LmwH9SNIWF6NXFayTWTLexZ4eusFcakafZOp8qT0sKuY020w4QUAHYUVdog7RP7e+NXKUxL+0yhKXZQ2id6EWLLoh9fC75Nt6vcwPexck9315J4UvDtByEYrYg9UtqxHtEnpTO7V6t4NFbaW4NTZbFP8PHDlSqMCKn4VcUSwAG8KQzzImZ0loqX1R/BNeEIMNyqwpTQ02MFHZnx3/PFTEHdbvU/jfWfaVX4diw8VNBY/iySPYsFdbvVfyPWfyt7cUOucFuU33TgzHI0u9DtRD/z8Z7sRb4jd0Z5vqCx9wu+64X+QpR3tSr8WfgimwoaGxDm9KLyi72s/lj09adWhddi4ZqQAB2iIfEEWDq1/tfId+RylENr4UiHuDXKfzmxfEd+ibL0SaxGbI7yYvYi35EsWrWMBOsMd0eZRa8lHZmN8oHa3CmPiSjnshf5jpyK8tG6vOkCj0V5olXhsJQ0tkzGluGkzrneds/JAu2OSkljtuiXjMiv+FiI0bsKGOwFiqQou4S97iOrMPm7o7Ez1fhVOfokWvWF1Srmj7qF2Yoa8bTE3LclIF6Jlc8JB/71gn58K/h2oIjCoMT1tmUrasSrEhdcmHHcGZWuSDF7LbEdfwg+dXyV8a5EiNVJXi/HuEQYHi5joCEw8Nk9xVokk0M5H0qT2ISRyF8rVHbpUgCjwi1A19cKGbZKi39ePbnYdmk6LUQfKsEWgX3MAsC03oTmfiE6ZQv7tJSyV4aGFACaAqE8WZHtPjwl7RM9uwzNY4c01TLWfp/AAHaKUbxk6W3ugmpvi1fFoDC9snSmKWSkx/E6nsV9AiMzEJ9NwqXRcwLBdkIiPLK044AafxjIoyEkmkeU/4XjAyEB7KoDVf5UsxEP4yGBtbxDCNe3xPJL+FGIRnPC2WPd/FRzHVXjH1JEOXfBmmB+AAAAAElFTkSuQmCC"},
            {"descricao":"Insatisfeito", "valor": 50, "porcentagem":3, icone:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAAEYUlEQVRoge2a328VRRTHP1cu9CZg4d5SfAVj0aIpDU8k/IpGBGJCqg+o+AIJRF+khAcSgj/eTPRNUP4JHnySBhKERiSAFIohoT8kUSgv/KgGtNIUcnk4Z5i55XZ3dnfutiH9JptJZs85e2b3zJkz31mYxcxCIaCtZmADsBZ4DVgOVIAX9f4DYBQYAgaAM8Bp7Z92NAEfAj3ABFBNeE0Ax4APgHk5+w5ACegGRhynHgI/A18AXUA7UAbm6lXWvi7gS+CU6hj9m8AetZ0LNgHDjgO/AbuAhSlsLQJ2Axcde0PAO0E8nQIl4AfngX2BH7gZuOzYP4yEblC8hLz5KvAf8BkwJ/RD1GY3MKbPOg8sCWV8KTaUrgFvhDIcgQ5gEBtqS7MabHUMXgAWZzWYAGUkRVeBP5CoSIUSNpzOAvNDeJcQ84Fz2DBLNWeOYMOpEsy15GjBRsXhpMpbsBM7jzkRhw5sAtjkq1RCYrKKZKeZgr2IT8N4Lpr7sOtEI1JsWhSBfsS3vXHCTcAtFfZZ7LqQMmXEUz6rvgn5EWIm/sfYsiMOLwP/Y1fiB9rnizT6BSRSqsD2KMHjKrTLw5FvHSfM9Y2HXlb9T1S2ZyqBMvAIqUh9CsArdRzp99DLql8GxpEtwKJ6Al1q7KSnI//UceRvT92s+r0qv9V0vODcXKvt6QTOTBdOabvOdLgDadf2d09jf3n2NUL/irbG55qBtGk75GnsuGdfI/SNj231bt5F4q7F09gyatPnfe3zRRb9xapzp97Ncb2ZhATYiuy1bwAbE+hl1W/C8gTPIM1ApgvPDMSdI/9quyBPj1KiWdv7psMdyD1tU+/EcoTZx4+aDncgw9ouz82d9HhV26cZ1h3INW1X5uZOLYrIHv2Mh2yHtgOmwx2IMfBmGL8SYwewBqml4mB8/KXeTbdorFuMNRBt2NprW4xsBVs0Nk8lZMr43QkdaQEOAieA23pdQgiMt6n98pOxAilNqsBRj2d9qrLHooTMxuqih0GDnUjVGsW6Xwc+B1Zhd3adwNfY1b2XeMqpgLygKvBRlGAJu9X1YSv2O87+iLz9CpIeVyObpz9jBvkI+M5jEADvYpn7WI7LkA+XiCYfNgKP1ZGdEXIF4C2EAL+MhN0oUsF+j3+WLGI3Y3t8FFw6qDtC7qrKHPB0JCvMCx4kAeNo2IoxbM6ejD6Ezpyb0UEfdGLnUmK2xpyFDOJf2jcCrdjTgENpDLgk9jmmh8RegJDXmUhskLcxgD1WaA3hnScqwK8EOFYwWIb9tIPkU4t1Os8MctBj4B69jSHcazGUcQdFJDuZiR306M1g8mFoP5LdQqCALHYuaXeIBhyGuthM7fF0H0Jj+lStk1FBaidTduRyPO2ihISX+8PAOFIvfQW8B7yOpO15erUgh0bvq0wvlidwfxho6FeYCk0IK96DlCpRNVW9awL4CSkAMw0g5E81C4H1CI3ZDryCpGv3p5rbSCodQDZFvTgEwiyeJzwBEuNyhRrIuKYAAAAASUVORK5CYII="},
            {"descricao":"Péssimo", "valor": 50, "porcentagem":20, icone:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAAEKUlEQVRoge2aSYyMQRTHf8OYaft0j8FFEPuS4S7c7CHDRewXwmUQXK2nsZyIxN1ZnBC7iX3nwGxcMCOxjMQyTJB2eK9ShV7qW7p7iH/ypTpV773vX/VVvXr1quE/ehbKYrSVAmYBM4DJwBhgKNAf+AF8BDqBVqAZuApc1vqSIwGsBs4iZNMBn2/AKWAZUFFk7gD0BbYBHQ6pr8BFYAdQB0wCkkAffZJaVwfsBC6pjtF/AWxCBqcoWAg8cwjcAdYBg0PYqgLWA3cde63AnFiYZkECOOq88F7ML5wHPHDsHwYqY7QPwHCEeBr4DNQDveN+idrcDHTpu24hDiMWjAaequEmYGpchnOgFmjBTrVRUQ3WOAZvA0OiGgyAJOKi08hADgtrKIGdTteR/aDY6A/cxE6zUGvGLOwmZLMrFaqxs+JwUOWF2IVdjDWRD7VYBzDXV6kvdp+oLwyvUNiCcGrDc9Pcjt0nCuFiw6IceIhw25JPuBJoV+HZheUVCgsQbh3k+SqrsGFHT0QZ1pOuyCV4ToXWFYFUWGxAOJ7OJpACviMRqU8AWAHsQz5zO9BAsFA8rH4S6EaOAFWZBOqQnl70JNLAn+eLBk/dqPqXVX5xpsaD2rjD05hxCu7T7qkbVX+3yh8wFb2cxklaPgpA5nekI+gG0TccJ5oKtyPjtGzzNHbMs64Q+q1ajs/U+BYZkWpPYxXInG4n/GIPqz9Eub7J1NitjSVJAgREJTZPAPw6tf5quB35pOWAUhAJiEFafjAVbkfeaRn6JFZEmHN8p6lwO2K8VUZP0MMwQUvjvX7pSJOW0yK8oBxJ6xxAztvPkcPZZ/19BdiPHI6iHBFqtWzO1GhClEshDFcBe4BX+KdLO5AdOkxir1FtLMrUmMQGjRmDsSxYhawvQ/Ax0qk5wAignz4jtG4v8MSRf6c2fJHCBo2DsgmdUePrPQxWASccQueRTLwvZgIXHP3j+A3gRpU/lUtopQrd9TB4W2XfA2s85LNhrdowKZ9cKAPuq+zyXIIJbFSaL1txAzmtjfQgmw8j1daNPHImu/MCjxzXVhW+T89LPjxCuG3yUUhgc72bC8crMMwAtxAg4zhflbqwPruUmA58QTgFvso4gh0B39C+EKhBoo40cCiMgQSSFkojieRSJLEHIJ4sUhIbZDSasdcKNXGw80QKuEYM1woGo7GftoVosZgvpjvvjOWix2AYdpp1IbnX8riMOyhHvJNZ2LFevRkksA4gjSSU58dkuwzZ7Mw+YRZ27JehLuZhP7vJ2m9Ags6gSCGxkwk7inI97SKBTK+XDoFuJLzeBSwBpiBuu0KfauTSaKnKNGITHu4fBgr6FbKhEsmKn0aOAL5nEfN8A04iAWCkDsT5p5rByJ9qZiJZy7GIux6o7R+B14grbUZOi404CYT/+JfwE2IWVCx3I3pVAAAAAElFTkSuQmCC"},      
      ],
      perguntaList:[
        {id:0, descricao: 'Todos'},
        {id:1, descricao: 'O que motiva você a comprar com a Info Store?'},
        {id:2, descricao: 'O quão satisfeito você ficou com nosso atendimento?'},
        {id:3, descricao: 'O quanto conseguimos atender todas as suas expectativas?'},
        {id:4, descricao: 'Qual a probabilidade de você fazer novas compras na Info Store?'},
        {id:5, descricao: 'O quanto você recomendaria a empresa Info Store para seus amigos e/ou parentes?'},
      ],
      preferencesChart: {
        data: {
          labels: ['30%', '50%', '10%', '8%', '2%'],
          series: [100, 150, 10, 20, 5]
        },
        options: {}
      }
    };
  },

  methods: {
    // initialize() {
    //   var self=this;
    //   this.axios.get(API_URL_LISTAR, {}).then(function(lista) {
    //     self.listaOpcoes.map(opc => {
    //       self.preferencesChart.data.labels.push(opc.descricao);
    //       self.preferencesChart.data.series.push(opc.porcentagem);
    //     })
    //     this.totalParticipantes = lista.total_participantes;
    //     this.listaOpcoes = lista.total_por_opcao;
    //   });
    // }
  },
//  mounted() {
//    this.initialize();
//  }
};
</script>
<style></style>
