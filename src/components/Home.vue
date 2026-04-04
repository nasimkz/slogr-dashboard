<template>
  <div id="map"></div>
  <!-- Pop-up element for no connections message -->
  <div id="no-connections-popup" class="popup">
    <p>No connections available</p>
  </div>
  <div id="loader" class="loader">Loading...</div>
  <!-- Onboarding overlay: shown when no groups/agents are configured -->
  <div v-if="!loading && !hasAgents" class="onboarding-overlay">
    <div class="onboarding-card">
      <i class="fa-solid fa-satellite-dish fa-3x mb-3 text-secondary"></i>
      <h4 class="mb-2">No agents deployed yet</h4>
      <p class="text-muted mb-3">Deploy your first agent to start monitoring network paths and SLA performance.</p>
      <RouterLink to="/sentinel" class="btn btn-sm btn-primary">Go to Sentinel →</RouterLink>
    </div>
  </div>
  <div class="position-relative bg-secondary mt-md-2 ms-md-3 opacity-75">
    <div class="position-absolute p-2">
      <div class="card bg-light" style="width: 190px; height: 260px">
        <div class="card-body">
          <RouterLink to="/groups" class="text-decoration-none text-dark"><h6 class="card-title mb-0">Groups</h6></RouterLink>
          <hr class="hr1" />
          <perfect-scrollbar style="height: 100px">
            <!-- Use v-for to iterate over the groups -->
            <div class="text-center m-2" v-if="loading">
              <VueSpinner size="60" color="#8cb63d" />
            </div>
            <div v-else>
              <div
                v-for="group in groups"
                :key="group.id"
                class="d-flex justify-content-between align-items-center"
              >
                <label
                  class="form-check-label"
                  :for="'flexSwitchCheckDefault_' + group.id"
                  data-bs-toggle="popover"
                  :title="group.name"
                  :data-content="group.name"
                >
                  {{
                    group.name.length > 9
                      ? group.name.substring(0, 9) + "..."
                      : group.name
                  }}</label
                >
                <div class="form-check form-switch" v-if="!loading">
                  <input
                    class="form-check-input fs-5"
                    type="checkbox"
                    role="switch"
                    :id="'flexSwitchCheckDefault_' + group.id"
                    v-model="groupSwitches[group.id]"
                    @change="
                      handleToggleGroup(group.id, groupSwitches[group.id])
                    "
                  />
                </div>
              </div>
            </div>
          </perfect-scrollbar>
          <!-- <hr class="hr" /> -->
          <hr class="hr1" />
          <h6 class="my-1">Map Settings</h6>
          <div class="">
            <label
              class="form-check-label"
              @click="clearLines"
              style="color: var(--primary_color); cursor: pointer"
              ><i class="fa-solid fa-circle-xmark" style="color: var(--primary_color); margin-top: 5px"></i> Clear Connections</label
            >
            <label
              class="form-check-label"
              @click="zoomDeafault"
              style="color: var(--primary_color); cursor: pointer"
              ><i class="fa-solid fa-down-left-and-up-right-to-center" style="color: var(--primary_color); margin-top: 5px"></i> Deafaut View</label
            >
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    class="position-relative bg-secondary mt-md-4 ms-md-3 opacity-75"
    style="width: 190px; top: 260px"
  >
    <div class="position-absolute p-2">
      <div class="card bg-light" style="width: 190px; height: 290px">
        <div class="card-body">
          <h6 class="card-title mb-0">Monitoring Profile</h6>
          <hr class="hr1" />
          <perfect-scrollbar style="height: 150px">
            <div class="text-center m-2" v-if="loading">
              <VueSpinner size="60" color="#8cb63d" />
            </div>
            <div v-else>
              <div
                v-for="profile in profiles"
                :key="profile.id"
                class="d-flex justify-content-between align-items-center"
              >
                <label
                  class="form-check-label"
                  :for="'profileDefault' + profile.id"
                  data-bs-toggle="popover"
                  :title="profile.name"
                  :data-content="profile.name"
                >
                  {{
                    profile?.name.length > 9
                      ? profile.name.substring(0, 9) + "..."
                      : profile.name
                  }}
                </label>
                <div class="form-check form-switch">
                  <input
                    class="form-check-input fs-5"
                    type="checkbox"
                    role="switch"
                    v-model="profileSwitches[profile.id]"
                    :id="'profileDefault' + profile.id"
                    @change="handleProfileToggle(profile.id, profile.name)"
                  />
                </div>
              </div>
            </div>
          </perfect-scrollbar>
          <hr class="hr1" />
          <h6 class="my-1">Monitoring</h6>
          <RouterLink
            to="/monitor"
            class="text-decoration-none"
            style="color: var(--primary_color)"
          >
            <span
              ><i
                class="fa-solid fa-gear"
                style="color: var(--primary_color); margin-top: 5px"
              ></i>
              Profile Setting</span
            >
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { RouterLink } from "vue-router";
import { VueSpinner } from "vue3-spinners";
import { PerfectScrollbar } from "vue3-perfect-scrollbar";
import mapboxgl from "mapbox-gl";
import DOMPurify from "dompurify";
import {
  fetchClusters,
  fetchAgentlinks,
  fetchGroups,
  fetchGroupData,
  fetchClustersData,
} from "../services/agent_services";
import { ProfileList } from "../services/monitor_profile_Services";

export default {
  data() {
    return {
      map: null,
      groups: [],
      groupdata: {},
      groupMarkers: {},
      clusterdata: {},
      clusters: [],
      groupSwitches: {},
      profileSwitches: {},
      profileSwitchesData: {},
      profiles: null,
      loading: false,
      initialGroupGeoJsonData: {},
      GroupGeoJson: {},
      mapLayers: [],
    };
  },
  components: {
    PerfectScrollbar,
    VueSpinner,
  },
  computed: {
    hasAgents() {
      return this.groups.length > 0
    },
  },
  async mounted() {
    var clusters = await this.handleClusters("");
    var sessions = await this.handleSessions("");
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
    this.map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/light-v11",
      center: [0, 20],
      zoom: 1.8,
      minZoom: 1.8,
    });

    // Change water color to blue
    let myMap = this.map;
    myMap.on("style.load", function () {
      // Find the water layer in the style
      myMap.setPaintProperty("water", "fill-color", "#CEEAF2");
    });
    // Hide the Mapbox logo
    const logoContainer = document.querySelector(".mapboxgl-ctrl-logo");
    if (logoContainer) {
      logoContainer.style.display = "none";
    }
    const attrib = document.querySelector(
      ".mapboxgl-ctrl.mapboxgl-ctrl-attrib"
    );
    if (attrib) {
      attrib.style.display = "none";
    }
    const nav = new mapboxgl.NavigationControl();
    this.map.addControl(nav, "bottom-right");

    this.handleData();
    // this.handleGroups();
    this.handleProfiles();
    // this.handleClusterData();
    this.handleGroupData();

    this.map.on("load", () => {
      this.showClusters(clusters);
      // inspect a cluster on click
      this.map.on("click", "clusters", (e) => {
        const features = this.map.queryRenderedFeatures(e.point, {
          layers: ["clusters"],
        });
        const clusterId = features[0].properties.cluster_id;
        this.map
          .getSource("earthquakes")
          .getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (err) return;
            this.map.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom,
            });
          });
      });

      let popup = new mapboxgl.Popup({ offset: [0, -15] });
      this.map.on("mouseenter", "clusters", async (e) => {
        const features = this.map.queryRenderedFeatures(e.point, {
          layers: ["clusters"],
        });

        if (features.length > 0) {
          var clusterId = features[0].properties.cluster_id;
          let clusterPointCount = features[0].properties.point_count;

          let map = this.map;
          var allPointsInCluster = [];
          async function getAllSubChildPoints(clusterId, callback) {
            function querySubCluster(subClusterId) {
              map
                .getSource("earthquakes")
                .getClusterChildren(subClusterId, function (err, features) {
                  if (err) return callback(err);

                  features.forEach(async function (feature) {
                    if (feature.properties.cluster) {
                      // If it's another cluster, recursively query its children
                      await querySubCluster(feature.properties.cluster_id);
                    } else {
                      // If it's a point, add it to the list
                      allPointsInCluster.push(feature);
                    }
                  });

                  if (features.length === 0) {
                    // No more features in the current sub-cluster, callback with the result
                    callback(null, allPointsInCluster);
                  }

                  if (allPointsInCluster.length === clusterPointCount) {
                    let subPropObj = {};
                    allPointsInCluster.forEach(function (sub) {
                      if (!subPropObj[sub.properties.organization]) {
                        subPropObj[sub.properties.organization] = 1;
                      } else {
                        subPropObj[sub.properties.organization] += 1;
                      }
                    });

                    let nodesCount = "";
                    for (const [key, value] of Object.entries(subPropObj)) {
                      nodesCount += `<p>${key}: ${value}</p>`;
                    }

                    popup
                      .setLngLat(features[0].geometry.coordinates)
                      .setHTML(
                        DOMPurify.sanitize(`<h5>Cluster nodes: ${clusterPointCount}</h5> ${nodesCount}`)
                      )
                      .setLngLat(features[0].geometry.coordinates)
                      .addTo(map);
                  }
                });
            }
            // Start the recursive query
            await querySubCluster(clusterId);
          }

          // Call the recursive function to get all sub-child points
          await getAllSubChildPoints(
            clusterId,
            function (err, subChildPoints) {}
          );
        }
      });
      this.map.on("mouseleave", "clusters", () => {
        popup.remove();
      });
      this.map.on("click", "unclustered-point", async (e) => {
        this.map.getCanvas().style.cursor = "pointer";
        const markerId = e.features[0].properties.id;
        const agentLinks = await this.handleAgentlinks(markerId);

        const popupElement = document.getElementById("no-connections-popup");
        const loader = document.getElementById("loader");

        // Show the loader while waiting for the asynchronous action
        loader.style.display = "block";

        // Hide the loader and show the popup (if needed) after 2 seconds
        setTimeout(() => {
          loader.style.display = "none";
          if (agentLinks.length === 0) {
            popupElement.style.left = e.point.x + "px";
            popupElement.style.top = e.point.y + "px";
            popupElement.style.display = "block";
            setTimeout(() => {
              popupElement.style.display = "none";
            }, 1000);
          } else {
            popupElement.style.display = "none";
            const agentFeatureCollection = {
              type: "FeatureCollection",
              features: agentLinks.map(link => ({
                type: "Feature",
                geometry: {
                  type: "LineString",
                  coordinates: link.coordinates
                },
                properties: {
                  color: link.color || 'grey',
                  session_id: link.session_id,
                  server: { machine_name: '', Organization: '', platform: '', location: '', Country: '' },
                  client: { machine_name: '', Organization: '', platform: '', location: '', Country: '' }
                }
              }))
            };
            this.drawLines(this.map, agentFeatureCollection, markerId);
          }
        }, 1000);
      });

      this.map.on("mouseenter", "clusters", () => {
        this.map.getCanvas().style.cursor = "pointer";
      });
      this.map.on("mouseleave", "clusters", () => {
        this.map.getCanvas().style.cursor = "";
      });

      // When a marker is clicked, call displayConnections
      this.map.on("click", "markers", (e) => {
        const markerCoordinates = e.features[0].geometry.coordinates;
        const markerId = e.features[0].properties.id;

        // Find connections for the clicked marker using markerId
        const connections = sessions.filter(
          (session) => session.from === markerId
        );

        if (connections.length > 0) {
          // If there are connections, display them
          this.displayConnections(markerCoordinates, connections);
        }
      });
    });
    this.map.setProjection("Mercator");
  },
  methods: {
    async handleProfileToggle(profileId, profileName) {
      let isProfile = this.profileSwitches[profileId]; // profile test
      let map = this.map;
      let profileSwitchesData = this.profileSwitchesData;
      let groupGeoJson = this.GroupGeoJson;

      Object.keys(profileSwitchesData).forEach(function (k) {
        if (k !== isProfile) {
          delete profileSwitchesData[k];
          document.getElementById("profileDefault" + k).checked = false;
        }
      });

      this.mapLayers.forEach(function (layer) {
        let sourceId = map.getLayer(layer).source;
        let allLines = map.querySourceFeatures(sourceId, {
          sourceLayer: layer,
        });

        if (isProfile) {
          profileSwitchesData[profileId] = profileName;
        }

        allLines.forEach(function (line) {
          let lineFeature = groupGeoJson[layer].features.find(
            (feature) => feature.properties.id === line.properties.id
          );
          if (isProfile) {
            lineFeature.properties.color = line.properties[profileName];
          } else if (Object.keys(profileSwitchesData).length < 1) {
            lineFeature.properties.color = "grey";
          }
          map.getSource(sourceId).setData(groupGeoJson[layer]);
        });
      });
    },
    async handleToggleGroup(groupId, switchValue) {
      let map = this.map;
      let myGroupMarkers = this.groupMarkers[groupId];
      if (this.mapLayers.length == 0) {
        let clusterLayers = ["clusters", "cluster-count"];
        clusterLayers.forEach(function (layerId) {
          map.setLayoutProperty(layerId, "visibility", "visible");
        });
      }

      if (switchValue) {
        // Draw connected lines
        const sessions = await this.handleSessions(groupId);
        this.drawLines(this.map, sessions, groupId);
        this.mapLayers.push(`line-${groupId}`);
      } else {
        // Remove the group from the list of active groups
        this.map.removeLayer(`line-${groupId}`);
        this.map.removeSource(`line-${groupId}`);

        let index = this.mapLayers.indexOf(`line-${groupId}`);
        if (index >= 0) {
          this.mapLayers.splice(index, 1);
        }
        delete this.GroupGeoJson[`line-${groupId}`];

        if (myGroupMarkers) {
          myGroupMarkers.forEach(function (marker) {
            marker.remove();
          });
        }
        delete this.groupMarkers[groupId];
      }

      // Show and Hide clusters on group toggle
      if (this.mapLayers.length > 0) {
        let clusterLayers = ["clusters", "cluster-count"];
        clusterLayers.forEach(function (layerId) {
          map.setLayoutProperty(layerId, "visibility", "none");
        });
      } else {
        let clusterLayers = ["clusters", "cluster-count"];
        clusterLayers.forEach(function (layerId) {
          map.setLayoutProperty(layerId, "visibility", "visible");
        });
      }
    },
    async handleClusters(groupId) {
      try {
        let respData;
        if (groupId === "") {
          respData = await fetchClusters("");
        } else {
          respData = this.clusterdata[groupId];
        }
        return respData;
      } catch (error) {
        // cluster fetch failed
      }
    },
    async handleSessions(groupId) {
      const respData = this.groupdata[groupId];
      return respData;
    },
    async handleAgentlinks(id) {
      const respData = await fetchAgentlinks(id);
      return respData;
    },
    async handleGroupData() {
      try {
        const response = await fetchGroupData();
        // const response = await fetchGroups();
        this.groupdata = response;
      } catch (error) {
        // group data fetch failed
      }
    },
    async handleClusterData() {
      try {
        this.loading = true;
        const response = await fetchClustersData();
        // const response = await fetchGroups();
        this.clusterdata = response;
      } catch (error) {
        // cluster data fetch failed
      } finally {
        this.loading = false; // Reset loading after API request completion
  }
    },
    async handleGroups() {
      try {
        // this.loading = true;
        // const response = await fetchGroupData();
        const response = await fetchGroups();
        this.groups = response;
      } catch (error) {
        // groups fetch failed
      } finally {
          this.loading = false;
      }
    },
    async handleData() {
      try {
        this.loading = true;
        const [groupResponse, clusterResponse] = await Promise.all([
          fetchGroups(),
          fetchClustersData(),
        ]);
        this.groups = groupResponse;
        this.clusterdata = clusterResponse;

      } catch (error) {
        // data fetch failed
      } finally {
        this.loading = false;
      }
    },
    async handleProfiles() {
      try {
        // this.loading = true;
        const resp = await ProfileList();
        this.profiles = resp.profiles;
      } catch (errors) {
        // profile fetch failed
      }
      // finally {
      //   this.loading = false;
      // }
    },
    showClusters(clusters) {
      // Add a new source from our GeoJSON data and
      // set the 'cluster' option to true. GL-JS will
      // add the point_count property to your source data.
      this.map.addSource("earthquakes", {
        type: "geojson",
        data: clusters,
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
      });

      this.map.addLayer({
        id: "clusters",
        type: "circle",
        source: "earthquakes",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#8cb63d",
            100,
            "#f1f075",
            750,
            "#f28cb1",
          ],
          "circle-radius": [
            "step",
            ["get", "point_count"],
            20,
            100,
            30,
            750,
            40,
          ],
        },
      });

      this.map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "earthquakes",
        filter: ["has", "point_count"],
        layout: {
          "text-field": ["get", "point_count_abbreviated"],
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
      });
      const organizationColors = {};
      clusters.features.forEach((feature) => {
        const org = feature.properties.organization;
        if (!(org in organizationColors)) {
          // You can use your getColor function to dynamically set colors
          organizationColors[org] = this.getColor(org);
        }
      });
      // Add unclustered points layer with dynamically set colors
      this.map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "earthquakes",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": [
            "match",
            ["get", "organization"],
            "GCP",
            "#8cb63d", // Green
            "AZURE",
            "#f1f075", // Yellow
            "#f28cb1", // Default color
          ],
          "circle-radius": 8,
          "circle-stroke-width": 3,
          "circle-stroke-color": "#fff",
        },
      });
    },
    getColor(organization) {
      // Add your logic here to determine the color based on the organization
      // For example, you can use a switch statement or if-else conditions
      switch (organization) {
        case "GCP":
          return "#8cb63d"; // Green
        case "AZURE":
          return "#f1f075"; // Yellow
        default:
          return "#f28cb1"; // Default color
      }
    },
    drawLines(map, lines, group_id) {
      let uniqueId = "line-" + group_id;
      let lineFeatures = [];
      let checkLineIds = [];

      function drawCurved(startCoords, endCoords) {
        var controlPoint = [
          (startCoords[0] + endCoords[0]) / 2,
          startCoords[1] - 0.1,
        ];
        var curvePoints = [];
        for (var t = 0; t <= 1; t += 0.01) {
          var x =
            Math.pow(1 - t, 2) * startCoords[0] +
            2 * (1 - t) * t * controlPoint[0] +
            Math.pow(t, 2) * endCoords[0];
          var y =
            Math.pow(1 - t, 2) * startCoords[1] +
            3 * (1 - t) * t * controlPoint[1] +
            Math.pow(t, 2) * endCoords[1];
          curvePoints.push([x, y]);
        }
        return curvePoints;
      }

      // function addMarker(properties, coordinates) {
      //   let el = document.createElement("div");
      //   el.className = "my-marker-icon";
      //   let marker = new mapboxgl.Marker(el).setLngLat(coordinates).addTo(map);

      //   console.log(properties);

      //   let el = document.createElement('div');
      //   const org = properties.client.Organization;
      //   const server = properties.server.machine_name;
      //   const client = properties.client.machine_name; */

      //   if (org === 'GCP') {
      //     el.className = 'gcp-marker';
      //   } else  if (org === 'Azure') {
      //     el.className = 'azure-marker';
      //   } else {
      //    el.className = 'default-marker';
      //   }

      //   let marker = new mapboxgl.Marker(el)
      //     .setLngLat(coordinates)
      //     .addTo(map);

      //   let popupHTML = `<h5>${org}</h5><p>server: ${server}</p><p>client: ${client}</p>`
      //   let markerPopup = new mapboxgl.Popup()
      //   marker.getElement().addEventListener('mouseenter', function () {
      //     markerPopup
      //       .setLngLat(coordinates)
      //       .setHTML(popupHTML)
      //       .addTo(map);
      //   });

      //   marker.getElement().addEventListener("mouseleave", function () {
      //     // Close the popup on mouse leave
      //    markerPopup.remove();
      //   });
      //   return marker;
      // }
      function addMarker(properties, coordinates) {
        let el = document.createElement("div");
        const org = properties.client.Organization;
        const server = properties.server.machine_name;
        const client = properties.client.machine_name;

        if (org === "GCP") {
          el.className = "gcp-marker";
        } else if (org === "Azure") {
          el.className = "azure-marker";
        } else {
          el.className = "default-marker";
        }

        let marker = new mapboxgl.Marker(el).setLngLat(coordinates).addTo(map);

        let popupHTML = DOMPurify.sanitize(`<h5>${org}</h5><p>server: ${server}</p><p>client: ${client}</p>`);
        let markerPopup = new mapboxgl.Popup();
        marker.getElement().addEventListener("mouseenter", function () {
          markerPopup.setLngLat(coordinates).setHTML(popupHTML).addTo(map);
        });

        marker.getElement().addEventListener("mouseleave", function () {
          // Close the popup on mouse leave
          markerPopup.remove();
        });
        return marker;
      }

      let groupMarkersList = [];
      lines["features"].forEach(function (line) {
        if (!checkLineIds.includes(line["properties"]["session_id"])) {
          let cur = drawCurved(
            line["geometry"]["coordinates"][0],
            line["geometry"]["coordinates"][1]
          );
          let m1 = addMarker(
            line["properties"],
            line["geometry"]["coordinates"][0]
          );
          let m2 = addMarker(
            line["properties"],
            line["geometry"]["coordinates"][1]
          );
          groupMarkersList.push(m1);
          groupMarkersList.push(m2);

          const obj = {
            type: "Feature",
            geometry: {
              // zaheer: comment this out, if you don't need curved lines
              type: "LineString",
              coordinates: cur,
            },
            // geometry: line["geometry"],
            properties: line["properties"],
          };
          lineFeatures.push(obj);
          checkLineIds.push(line["properties"]["session_id"]);
        }
      });
      this.groupMarkers[group_id] = groupMarkersList;

      this.initialGroupGeoJsonData = {
        type: "FeatureCollection",
        features: lineFeatures,
      };

      this.GroupGeoJson[uniqueId] = this.initialGroupGeoJsonData;
      this.map.addSource(uniqueId, {
        type: "geojson",
        data: this.initialGroupGeoJsonData,
      });

      this.map.addLayer({
        id: uniqueId,
        type: "line",
        source: uniqueId,
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": ["get", "color"],
          "line-width": 1, // Maximum line width at higher zoom levels
        },
      });
    },
    clearLines() {
      const map = this.map;
      // Iterate through the layers to find and remove layers with 'line-' prefix
      map.getStyle().layers.forEach((layer) => {
        if (layer.id.startsWith("line-")) {
          map.removeLayer(layer.id);
          map.removeSource(layer.id);
          // Extract groupId from the layer id
          const groupId = layer.id.replace("line-", "");
          // Remove markers associated with the group
          const myGroupMarkers = this.groupMarkers[groupId];
          if (myGroupMarkers) {
            myGroupMarkers.forEach((marker) => marker.remove());
            delete this.groupMarkers[groupId];
          }
        }
      });
      this.groupSwitches = {};
      // Reset profile switches and associated UI elements
      this.clearProfileSwitches();
      // Show clusters after clearing lines
      const clusterLayers = ["clusters", "cluster-count"];
      clusterLayers.forEach((layerId) => {
        map.setLayoutProperty(layerId, "visibility", "visible");
      });
    },
    clearProfileSwitches() {
      const profileSwitchesData = this.profileSwitchesData;
      // Clear profile switches and associated UI elements
      Object.keys(profileSwitchesData).forEach((profileId) => {
        delete profileSwitchesData[profileId];
        document.getElementById("profileDefault" + profileId).checked = false;
      });
    },
    clearAll() {
      const map = this.map;

      // Remove cluster layers
      map.getStyle().layers.forEach((layer) => {
        if (
          layer.id.startsWith("clusters") ||
          layer.id.startsWith("unclustered-point")
        ) {
          map.removeLayer(layer.id);
        }
      });

      // Remove connection layers
      map.getStyle().layers.forEach((layer) => {
        if (layer.id.startsWith("line-")) {
          map.removeLayer(layer.id);
        }
      });

      // Remove cluster count layer
      const clusterCountLayer = map.getLayer("cluster-count");
      if (clusterCountLayer) {
        map.removeLayer("cluster-count");
      }

      // Remove cluster sources
      ["earthquakes"].forEach((source) => {
        if (map.getSource(source)) {
          map.removeSource(source);
        }
      });
    },
    handleLineHover(e) {
      const map = this.map;
      const lineId = e.features[0].layer.id;

      // Change the line color when hovering (you can customize the effect as needed)
      map.setPaintProperty(lineId, "#11b4da", "white");
    },
    resetLineHover(e) {
      const map = this.map;
      const lineId = e.features[0].layer.id;
      // Reset the line color to its original color when the mouse leaves
      map.setPaintProperty(lineId, "#11b4da", "white");
    },
    zoomDeafault() {
      // Define the default zoom level
      const defaultZoomLevel = 1.8;
      // Ease the map to the default center and zoom level
      this.map.easeTo({
        center: [0, 20],
        zoom: defaultZoomLevel,
      });
    },
  },
};
</script>

<style scoped>
#map {
  width: 100%;
  height: 91%;
  position: absolute;
  margin-top: 6px;
}

.popup {
  position: absolute;
  background: #fff;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 4px;
  z-index: 10;
  display: none;
}

#loader {
  display: none;
  /* Initially hide the loader */
  position: fixed;
  top: 50%;
  left: 50%;
  border: 16px solid #f3f3f3;
  border-top: 16px solid #3498db;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.map {
  position: relative;
  background-color: #c2c8ca;
  width: 100%;
  height: 1115px;
  overflow: hidden;
  text-align: left;
  font-size: var(--font-size-base);
  color: var(--color-black);
  font-family: var(--font-inter);
}

.marker {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='30' viewBox='0 0 20 30'%3E%3Cellipse cx='10' cy='28' rx='4' ry='2' fill='%23000' opacity='0.2'/%3E%3Cpath d='M10 0C5.6 0 2 3.6 2 8c0 6 8 22 8 22s8-16 8-22c0-4.4-3.6-8-8-8z' fill='%238cb63d'/%3E%3Ccircle cx='10' cy='8' r='4' fill='%23fff' opacity='0.6'/%3E%3C/svg%3E");
  background-size: cover;
  width: 20px;
  height: 30px;
  cursor: pointer;
}

.screenshot20210522At336 {
  position: absolute;
  top: 1px;
  width: 1920px;
  height: 1027px;
  object-fit: cover;
}

.addIcon {
  position: absolute;
  height: 9.66%;
  width: 5.61%;
  top: 10.76%;
  right: 1.74%;
  bottom: 79.58%;
  left: 92.66%;
  max-width: 100%;
  overflow: hidden;
  max-height: 100%;
}

.mapInner {
  position: absolute;
  top: 100px;
  left: 142px;
  width: 1330px;
  height: 900.43px;
}

.hr1 {
  margin: 0.6rem 0;
  color: inherit;
  border: 0;
  border-top: var(--bs-border-width) solid;
  opacity: 0.25;
}

.onboarding-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 91%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
  pointer-events: none;
}

.onboarding-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  max-width: 360px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  pointer-events: all;
}
</style>
