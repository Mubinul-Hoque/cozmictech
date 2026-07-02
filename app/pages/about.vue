<template>
  <div>
    <!-- ======= Breadcrumbs ======= -->
    <div class="breadcrumbs flex items-center" style="background-image: url('/assets/img/breadcrumbs-bg.jpg');">
      <div class="container mx-auto px-4 md:px-8 relative text-center" data-aos="fade">
        <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">About Us</h2>
        <ol class="flex justify-center gap-2 text-sm text-[#feb900] font-semibold">
          <li><NuxtLink to="/" class="text-white/80 hover:text-white">Home</NuxtLink></li>
          <li>About</li>
        </ol>
      </div>
    </div>

    <!-- ======= About Section ======= -->
    <section id="about" class="py-20 bg-white">
      <div class="container mx-auto px-4 md:px-8" data-aos="fade-up">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 relative">
          
          <div class="lg:col-span-6 bg-cover bg-center rounded-lg min-h-[400px] shadow-lg" style="background-image: url('/assets/img/about.jpg');"></div>

          <div class="lg:col-span-6 space-y-6">
            <h2 class="text-3xl font-bold text-[#2e3135]">
              {{ data?.aboutUs?.story_title || 'Together to Build a Better Future.' }}
            </h2>
            <div class="w-16 h-1 bg-[#feb900]"></div>
            
            <div class="space-y-4">
              <h4 class="text-sm font-bold text-[#feb900] uppercase tracking-wider">Est {{ data?.aboutUs?.est || '2020' }}</h4>
              <p class="text-gray-600 text-justify leading-relaxed whitespace-pre-line">
                {{ data?.aboutUs?.story_body || 'Cozmic Technology is a Bangladeshi Incorporated engineering firm. We specialize in Geotechnical Investigation, Engineering Consultancy, Architecture, Construction and Construction Project management services.\n\nWe design a wide range of building types that each excels at their function, provide a high-quality environment for people, and strengthen their client’s brands and identities.' }}
              </p>
              
              <ul class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-medium text-gray-700">
                <li class="flex items-center gap-2"><i class="bi bi-check-circle text-[#feb900]"></i> Geotechnical Investigation</li>
                <li class="flex items-center gap-2"><i class="bi bi-check-circle text-[#feb900]"></i> Detail Engineering Consultancy</li>
                <li class="flex items-center gap-2"><i class="bi bi-check-circle text-[#feb900]"></i> Procurement & Supply</li>
                <li class="flex items-center gap-2"><i class="bi bi-check-circle text-[#feb900]"></i> Construction Supervision</li>
                <li class="flex items-center gap-2"><i class="bi bi-check-circle text-[#feb900]"></i> Project Management</li>
                <li class="flex items-center gap-2"><i class="bi bi-check-circle text-[#feb900]"></i> Structural Integrity</li>
              </ul>

              <p class="text-gray-600 text-justify leading-relaxed mt-4">
                {{ data?.aboutUs?.story_body2 || 'We work closely with our clients to interpret their dreams/visions accurately in drawings and bring them to the desired reality through construction solutions to meet their needs.' }}
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- ======= Stats Counter Section ======= -->
    <section class="py-16 bg-gray-50 border-t border-b border-gray-100">
      <div class="container mx-auto px-4 md:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <!-- Stat 1 -->
          <div class="bg-white p-6 rounded-lg border border-gray-100 flex items-center gap-6 shadow-sm" data-aos="fade-up" data-aos-delay="100">
            <div class="w-14 h-14 bg-blue-50 text-blue-600 flex items-center justify-center text-3xl rounded-full">
              <i :class="data?.aboutUs?.happy_icon || 'bi bi-emoji-smile'"></i>
            </div>
            <div>
              <span class="block text-3xl font-extrabold text-[#0f172a]">
                <Counter :target="data?.aboutUs?.happy_client || 23" />
              </span>
              <p class="text-gray-500 text-xs font-semibold uppercase mt-1">Happy Clients</p>
            </div>
          </div>

          <!-- Stat 2 -->
          <div class="bg-white p-6 rounded-lg border border-gray-100 flex items-center gap-6 shadow-sm" data-aos="fade-up" data-aos-delay="200">
            <div class="w-14 h-14 bg-amber-50 text-amber-600 flex items-center justify-center text-3xl rounded-full">
              <i :class="data?.aboutUs?.projects_icon || 'bi bi-journal-richtext'"></i>
            </div>
            <div>
              <span class="block text-3xl font-extrabold text-[#0f172a]">
                <Counter :target="data?.aboutUs?.project_nos || 29" />
              </span>
              <p class="text-gray-500 text-xs font-semibold uppercase mt-1">Projects Completed</p>
            </div>
          </div>

          <!-- Stat 3 -->
          <div class="bg-white p-6 rounded-lg border border-gray-100 flex items-center gap-6 shadow-sm" data-aos="fade-up" data-aos-delay="300">
            <div class="w-14 h-14 bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl rounded-full">
              <i :class="data?.aboutUs?.support_icon || 'bi bi-headset'"></i>
            </div>
            <div>
              <span class="block text-3xl font-extrabold text-[#0f172a]">
                <Counter :target="data?.aboutUs?.hrs_support || 1740" />
              </span>
              <p class="text-gray-500 text-xs font-semibold uppercase mt-1">Hours of Support</p>
            </div>
          </div>

          <!-- Stat 4 -->
          <div class="bg-white p-6 rounded-lg border border-gray-100 flex items-center gap-6 shadow-sm" data-aos="fade-up" data-aos-delay="400">
            <div class="w-14 h-14 bg-rose-50 text-rose-600 flex items-center justify-center text-3xl rounded-full">
              <i :class="data?.aboutUs?.emp_icon || 'bi bi-people'"></i>
            </div>
            <div>
              <span class="block text-3xl font-extrabold text-[#0f172a]">
                <Counter :target="data?.aboutUs?.emp_nos || 35" />
              </span>
              <p class="text-gray-500 text-xs font-semibold uppercase mt-1">Hard Workers</p>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- ======= Alt Services Section 1 ======= -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4 md:px-8" data-aos="fade-up">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div class="relative overflow-hidden rounded-lg shadow-lg" data-aos="zoom-in" data-aos-delay="100">
            <img src="/assets/img/alt-services.jpg" alt="Services Detail" class="w-full h-[450px] object-cover" />
          </div>

          <div class="space-y-6">
            <h3 class="text-2xl font-bold text-[#2e3135]">
              {{ data?.aboutUs?.mission_title || 'OUR MISSION' }}
            </h3>
            <p class="text-gray-600 leading-relaxed text-justify">
              {{ data?.aboutUs?.mission_body || 'Our mission is to establish Cozmic Technology as a trusted, reliable and top-tier provider of engineering consultancy and geotechnical investigation services in the region. We strive to help our clients execute their projects safely and efficiently.' }}
            </p>
            <div class="border-l-4 border-[#feb900] pl-6 py-2 italic text-gray-500 text-sm">
              "Providing solutions that are secure, stable, and economically sound."
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- ======= Alt Services Section 2 ======= -->
    <section class="py-20 bg-gray-50 border-t border-b border-gray-100">
      <div class="container mx-auto px-4 md:px-8" data-aos="fade-up">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div class="space-y-6 order-2 lg:order-1">
            <h3 class="text-2xl font-bold text-[#2e3135]">
              {{ data?.aboutUs?.vision_title || 'OUR VISION' }}
            </h3>
            <p class="text-gray-600 leading-relaxed text-justify whitespace-pre-line">
              {{ data?.aboutUs?.vision_body || 'To be the most reliable and premium engineering consulting firm, leading with innovation and sustainable designs. We envision transforming construction environments and empowering clients with top-of-the-line structural, civil, and environmental engineering solutions.' }}
            </p>
          </div>

          <div class="relative overflow-hidden rounded-lg shadow-lg order-1 lg:order-2" data-aos="zoom-in" data-aos-delay="100">
            <img src="/assets/img/alt-services-2.jpg" alt="Services Detail" class="w-full h-[450px] object-cover" />
          </div>

        </div>
      </div>
    </section>

    <!-- ======= Our Team Section ======= -->
    <section id="team" class="py-20 bg-white">
      <div class="container mx-auto px-4 md:px-8" data-aos="fade-up">
        
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-[#2e3135] mb-4">
            {{ data?.aboutUs?.team_title || 'Our Team' }}
          </h2>
          <div class="w-16 h-1 bg-[#feb900] mx-auto mb-4"></div>
          <p class="text-gray-600">
            {{ data?.aboutUs?.team_description || 'We have a strong team of professional engineers, geotechnical experts, and architects working together to deliver high-quality consultancy.' }}
          </p>
        </div>

        <div class="flex flex-wrap justify-center gap-8 md:gap-12">
          <div v-for="(member, index) in data?.team || []" :key="member.id" class="team-member group w-full max-w-[280px]" data-aos="fade-up" :data-aos-delay="100 * (index + 1)">
            <div class="member-img relative overflow-hidden w-64 h-64 rounded-full mx-auto shadow-md border-4 border-slate-100">
              <img :src="member.image ? '/assets/img/team/' + member.image : '/assets/img/team/team-1.jpg'" :alt="member.name" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div class="social absolute inset-x-0 bottom-[-40px] h-10 bg-black/60 flex items-center justify-center gap-4 transition-all duration-300 opacity-0 group-hover:bottom-0 group-hover:opacity-100">
                <a :href="member.fb || '#'" target="_blank"><i class="bi bi-facebook"></i></a>
                <a :href="member.insta || '#'" target="_blank"><i class="bi bi-instagram"></i></a>
                <a :href="member.linkedin || '#'" target="_blank"><i class="bi bi-linkedin"></i></a>
              </div>
            </div>
            <div class="p-6 text-center">
              <h4 class="font-bold text-lg text-[#2e3135]">{{ member.name }}</h4>
              <span class="text-xs text-gray-500 uppercase tracking-wider font-semibold block mt-1">{{ member.designation }}</span>
              <p class="text-gray-600 text-xs mt-3 leading-relaxed" v-if="member.message">
                "{{ member.message }}"
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>

  </div>
</template>

<script setup>
const { data } = await useFetch('/api/about')
</script>
