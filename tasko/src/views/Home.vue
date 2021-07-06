<template>
  <div class="home">
    <div>
    <b-carousel
      id="carousel-1"
      v-model="slide"
      :interval="5000"
      controls
      indicators
      background="#ababab"
      img-width="1024"
      img-height="320"
      style="text-shadow: 1px 1px 2px #333;"
      @sliding-start="onSlideStart"
      @sliding-end="onSlideEnd"
    >
      <!-- Text slides with image -->
      <b-carousel-slide
        caption="Bienvenido a Tasko"
        text="Con tasko podras guardar tus notas y organizar tus proyectos."
        img-src="https://picsum.photos/id/1060/1080/480"
      ></b-carousel-slide>

      <!-- Slides with custom text -->
      <b-carousel-slide img-src="https://picsum.photos/id/1073/1080/480">
        <h1>Inicia sesion o registrate para comenzar a utilizarlo!</h1>
      </b-carousel-slide>

      <!-- Slides with image only -->
      <b-carousel-slide img-src="https://picsum.photos/id/119/1080/480"></b-carousel-slide>

    </b-carousel>
  </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  components: {
  },
  data() {
      return {
        slide:null,
        sliding: null
      }
    },
    methods: {
      onSlideStart() {
        this.sliding = true
      },
      onSlideEnd() {
        this.sliding = false
      }
    }
};
</script>
