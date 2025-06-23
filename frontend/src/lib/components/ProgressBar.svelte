<script lang="ts">
    // Komponen ini menerima satu prop: 'progress', yaitu persentase dari 0 hingga 100.
    export let progress: number;
  </script>
  
  <div class="relative w-full h-4 bg-slate-900 rounded-full mt-6 border-2 border-slate-600">
    <div 
      class="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-1000" 
      style="width: {progress}%"
    ></div>
    
    <div 
      class="absolute -top-4 transition-all duration-1000" 
      style="left: calc({progress}% - 16px);"
    >
      <span class="text-3xl">🚐</span>
    </div>
  </div>