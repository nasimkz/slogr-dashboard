<template>
  <div>
    <button
      class="addBtn"
      data-bs-toggle="modal"
      data-bs-target="#staticBackdrop"
    >
      <i class="fa-solid fa-plus fa-lg"></i> Add New Sessions
    </button>
    <!-- Modal  add-->
    <div
      class="modal fade"
      id="staticBackdrop"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add New Session</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleAddSessions">
              <div class="">
                <div class="mb-4">
                  <label for="exampleFormControlInput1" class="form-label ms-1"
                    >Form*</label
                  >
                  <input type="text" class="form-control mb-2" placeholder="Search agents..."
                    :value="agentQuery" @input="onAgentSearch($event.target.value)">
                  <select
                    v-model="selectedAgentId"
                    class="form-select form-select-lg mb-3 custom-select"
                    aria-label=".form-select-lg example"
                    required
                  >
                    <option class="text-secondary" disabled>
                      please select sender sentinel
                    </option>
                    <option
                      v-for="agent in filteredAgents"
                      :key="agent.id"
                      :value="agent.id"
                    >
                      {{ agent.name }}
                    </option>
                  </select>
                </div>
                <div class="mb-4">
                  <label for="exampleFormControlInput1" class="form-label ms-1"
                    >To*</label
                  >
                  <select
                    v-model="selectedClientId"
                    class="form-select form-select-lg mb-3"
                    aria-label=".form-select-lg example"
                    required
                  >
                    <option class="text-secondary" disabled>
                      please select receiver sentinel
                    </option>
                    <option
                      v-for="client in filteredClients"
                      :key="client.id"
                      :value="client.id"
                    >
                      {{ client.name }}
                    </option>
                  </select>
                </div>
                <!-- Advanced button -->
                <RouterLink to="#"
                  @click="toggleAdvancedFields"
                  class="ms-2 mt-2"
                >
                  {{ showAdvancedFields ? "Hide Advanced -" : "Show Advanced +" }}
                </RouterLink>
                <div v-if="showAdvancedFields">
                  <div class="mb-4">
                    <label
                      for="exampleFormControlInput1"
                      class="form-label ms-1"
                      >Monitoring Profile*</label
                    >
                    <input type="text" class="form-control mb-2" placeholder="Search profiles..."
                      :value="profileQuery" @input="onProfileSearch($event.target.value)">
                    <select
                      v-model="selectedProfile"
                      @change="updateSelectedProfileId"
                      class="form-select form-select-lg mb-3 custom-select"
                      aria-label=".form-select-lg example"
                      required
                    >
                      <option class="text-secondary" disabled>
                        select here
                      </option>
                      <option :value=0>
                        Default
                      </option>
                      <option
                        v-for="profile in filteredProfiles"
                        :key="profile.id"
                        :value="profile"
                      >
                        {{ profile.name }}
                      </option>
                    </select>
                  </div>
                  <div class="mb-3">
                    <div class="row g-2">
                      <div class="col-md-12">
                        <label
                          for="exampleFormControlInput1"
                          class="form-label ms-1"
                          >Schedule*</label
                        >
                        <input
                          type="number"
                          class="form-control form-control-lg"
                          placeholder="Enter Schedule"
                          v-model="this.form.schedule"
                          name="schedule"
                          required
                        />
                      </div>
                      <div class="col-md-6">
                        <label
                          for="exampleFormControlInput1"
                          class="form-label ms-1"
                          >Count*</label
                        >
                        <input
                          type="number"
                          class="form-control form-control-lg"
                          placeholder="Enter Count"
                          v-model="this.form.count"
                          name="count"
                          required
                        />
                      </div>
                      <div class="col-md-6">
                        <label
                          for="exampleFormControlInput1"
                          class="form-label ms-1"
                          >Number Of Packets*</label
                        >
                        <input
                          type="number"
                          class="form-control form-control-lg"
                          placeholder="Enter No-packets"
                          v-model="this.form.n_packets"
                          name="n_packets"
                          required
                        />
                      </div>
                      <div class="col-md-6">
                        <label
                          for="exampleFormControlInput1"
                          class="form-label ms-1"
                          >Packet Interval*</label
                        >
                        <input
                          type="number"
                          class="form-control form-control-lg"
                          placeholder="Enter P-Interval"
                          v-model="this.form.p_interval"
                          name="p_interval"
                          required
                        />
                      </div>
                      <div class="col-md-6">
                        <label
                          for="exampleFormControlInput1"
                          class="form-label ms-1"
                          >Wait Time*</label
                        >
                        <input
                          type="number"
                          class="form-control form-control-lg"
                          placeholder="Enter W Time"
                          v-model="this.form.w_time"
                          name="w_time"
                          required
                        />
                      </div>
                      <div class="col-md-6">
                        <label
                          for="exampleFormControlInput1"
                          class="form-label ms-1"
                          >DSCP*</label
                        >
                        <input
                          type="number"
                          class="form-control form-control-lg"
                          placeholder="Enter Dscp"
                          v-model="this.form.dscp"
                          name="dscp"
                          required
                        />
                      </div>
                      <div class="col-md-6">
                        <label
                          for="exampleFormControlInput1"
                          class="form-label ms-1"
                          >Packet Size*</label
                        >
                        <input
                          type="number"
                          class="form-control form-control-lg"
                          placeholder="Enter P_Size"
                          name="p_size"
                          v-model="this.form.p_size"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <hr />
              <div>
                <div class="d-flex justify-content-end">
                  <button
                    type="button"
                    class="modelCancelBtn"
                    id="EditCancelButton"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button type="submit" class="modelSaveBtn ms-2">
                    Create
                  </button>
                </div>
              </div>
            </form>
          </div>
          <!-- <div class="modal-footer">
                        <div class="d-flex justify-content-end">
                            <button type="button" class="modelCancelBtn" id="EditCancelButton"
                                data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="modelSaveBtn ms-2" @click="handleAddSessions"
                                :disabled="isCreateButtonDisabled">Create</button>
                        </div>
                    </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { agentListForm } from "../../services/agent_services";
import { ProfileListForm } from "../../services/monitor_profile_Services";
import { addSessions } from "../../services/sessions_services";
import { createToast } from "mosha-vue-toastify";
import "mosha-vue-toastify/dist/style.css";
import { RouterLink } from 'vue-router';
import { useDebounceFn } from '../../composables/useDebounceFn';

export default {
  name: "AddSessions",
  components: {},
  props: {
    getSessions: Function,
  },

  data() {
    return {
      form: {
        schedule: 600,
        count: 0,
        n_packets: 0,
        p_interval: 0,
        w_time: 0,
        dscp: 0,
        p_size: 0,
      },
      selectedProfileId: 0,
      selectedProfile: 0,
      profiles: [],
      selectedAgentId: `please select sender sentinel`,
      agents: [],
      selectedClientId: "please select receiver sentinel",
      clients: [],
      showAdvancedFields: false,
      profileQuery: '',
      agentQuery: '',
    };
  },
  created() {
    this.onProfileSearch = useDebounceFn(function (val) { this.profileQuery = val }, 300)
    this.onAgentSearch = useDebounceFn(function (val) { this.agentQuery = val }, 300)
  },
  computed: {
    filteredProfiles() {
      const q = this.profileQuery.trim().toLowerCase()
      if (!q) return this.profiles
      return this.profiles.filter(p => p.name?.toLowerCase().includes(q))
    },
    filteredAgents() {
      const q = this.agentQuery.trim().toLowerCase()
      if (!q) return this.agents
      return this.agents.filter(a => a.name?.toLowerCase().includes(q))
    },
    filteredClients() {
      const q = this.agentQuery.trim().toLowerCase()
      if (!q) return this.clients
      return this.clients.filter(c => c.name?.toLowerCase().includes(q))
    },
  },
  async mounted() {
    await this.monitor();
    await this.server();
  },
  methods: {
    async handleAddSessions(e) {
      e.preventDefault();
      const payload = {
        serve: this.selectedAgentId,
        client: this.selectedClientId,
        profile: this.selectedProfileId,
        schedule: this.form.schedule,
        count: this.form.count,
        n_packets: this.form.n_packets,
        p_interval: this.form.p_interval,
        w_time: this.form.w_time,
        dscp: this.form.dscp,
        p_size: this.form.p_size,
        edit: false,
      };

      try {
        await addSessions(payload);
        this.getSessions();
        this.form = {
          schedule: null,
          count: null,
          n_packets: null,
          p_interval: null,
          w_time: null,
          dscp: null,
          p_size: null,
        };
        (this.selectedAgentId = null),
          (this.selectedClientId = null),
          (this.selectedProfileId = null);
        createToast(`add sessions successfully`, {
          type: "success",
          position: "top-right",
          transition: "zoom",
        });
        document.getElementById("EditCancelButton").click();
      } catch (error) {
        if (error.response.status === 400) {
          createToast(error.response.data.error, {
            type: "danger",
            position: "top-right",
            transition: "zoom",
          });
        } else if (error.response.status === 401) {
          createToast(error.response.data.Unauthorized, {
            type: "warning",
            position: "top-right",
            transition: "zoom",
          });
          console.log("401", error.response.data.Unauthorized);
        } else {
          console.log("main-error-1", error);
        }
        console.log("main-error", error);
      }
    },
    async monitor(size = 1000) {
      try {
        let res = await ProfileListForm(size);
        this.profiles = res.profiles;
      } catch (error) {
        console.log(error);
      }
    },
    updateSelectedProfileId() {
      // Update selectedProfileId when the selection changes
      this.selectedProfile = this.selectedProfile;
      console.log("single", this.selectedProfile);
      this.selectedProfileId = this.selectedProfile.id;
      this.form.count = this.selectedProfile.count;
      this.form.n_packets = this.selectedProfile.n_packets;
      this.form.p_interval = this.selectedProfile.p_interval;
      this.form.w_time = this.selectedProfile.w_time;
      this.form.dscp = this.selectedProfile.dscp;
      this.form.p_size = this.selectedProfile.p_size;
    },
    async server(size = 1000) {
      try {
        let res = await agentListForm(size);
        this.agents = res.data.agents;
        this.clients = res.data.agents;
      } catch (error) {
        console.log(error);
      }
    },
    toggleAdvancedFields() {
      this.showAdvancedFields = !this.showAdvancedFields;
    },
  },
};
</script>

<style>
.custom-select {
  max-height: 100px;
  /* Adjust this value as needed */
  overflow: scroll;
}
</style>
