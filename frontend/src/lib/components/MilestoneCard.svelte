<script lang="ts">
    // Komponen ini menerima dua props:
    // 1. 'milestone': Objek yang berisi detail hadiah (target, nama, gambar, dll).
    // 2. 'achieved': Boolean yang menandakan apakah milestone ini sudah tercapai.
    export let milestone: { target: number; name: string; amount: string; image: string; };
    export let achieved: boolean;
  </script>
  
  <div class="flex flex-col items-center text-center">
    <div class="relative bg-slate-800 border-2 border-slate-600 rounded-full p-2 w-24 h-24 flex items-center justify-center overflow-hidden">
      <img 
        src={milestone.image} 
        alt={milestone.name}
        class="w-full h-full object-cover rounded-full {achieved ? 'grayscale-0' : 'grayscale'}" 
      />
      {#if achieved}
        <div class="absolute -top-2 -left-2 bg-orange-400 text-white text-xs font-bold px-2 py-1 rounded-full rotate-[-15deg] shadow-lg">GET</div>
      {/if}
    </div>
    
    <div class="mt-2 text-white text-sm h-12">
      <p>{milestone.name}</p>
      <p class="font-bold">{milestone.amount}</p>
    </div>
    
    <div class="mt-2 relative">
      <div class="w-4 h-4 rounded-full border-2 border-cyan-400 {achieved ? 'bg-cyan-400' : 'bg-slate-800'}"></div>
      <p class="text-slate-400 text-xs mt-1">{milestone.target.toLocaleString('en-US')}</p>
    </div>
  </div>