<template>
  <div
    @click="checkClick"
    ref="invoiceWrap"
    class="invoice-wrap flex flex-column"
  >
    <form @submit.prevent="submitForm" class="invoice-content">
      <LoadingComp v-show="loading" />
      <h1 v-if="!editInvoice">New invoice</h1>
      <h1 v-else>Edit invoice</h1>

      <!-- Bill From -->
      <div class="bill-from flex-flex-column">
        <div class="flex">
          <h4>Bill From</h4>
          <!-- <button type="button" @click="autoFill"></button> -->
        </div>
        <div class="input flex flex-column">
          <label for="billerStreetAddress">Street Adress</label>
          <input
            v-model="billerStreetAddress"
            id="billerStreetAddress"
            type="text"
            required
          />
        </div>

        <div class="location-details flex">
          <div class="input flex flex-column">
            <label for="billerCity">City</label>
            <input v-model="billerCity" id="billerCity" type="text" required />
          </div>

          <div class="input flex flex-column">
            <label for="billerZipCode">Zip Code</label>
            <input
              v-model="billerZipCode"
              id="billerZipCode"
              type="text"
              required
            />
          </div>

          <div class="input flex flex-column">
            <label for="billerCountry">Country</label>
            <input
              v-model="billerCountry"
              id="billerCountry"
              type="text"
              required
            />
          </div>
        </div>
      </div>

      <!-- Bill to -->
      <div class="bill-to flex flex-column">
        <h4>Bill To</h4>
        <div class="input flex flex-column">
          <label for="clientName">Client Name</label>
          <input v-model="clientName" id="clientName" type="text" required />
        </div>

        <div class="input flex flex-column">
          <label for="clientEmail">Client Email</label>
          <input v-model="clientEmail" id="clientEmail" type="text" required />
        </div>

        <div class="input flex flex-column">
          <label for="cleintStreetAddress">Street Adress</label>
          <input
            v-model="clientStreetAddress"
            id="cleintStreetAddress"
            type="text"
            required
          />
        </div>

        <div class="location-details flex">
          <div class="input flex flex-column">
            <label for="clientCity">City</label>
            <input v-model="clientCity" id="clientCity" type="text" required />
          </div>

          <div class="input flex flex-column">
            <label for="clientZipCode">Zip Code</label>
            <input
              v-model="clientZipCode"
              id="clientZipCode"
              type="text"
              required
            />
          </div>

          <div class="input flex flex-column">
            <label for="clientCountry">Country</label>
            <input
              v-model="clientCountry"
              id="clientCountry"
              type="text"
              required
            />
          </div>
        </div>
      </div>

      <!-- Invoice Work Details -->
      <div class="invoice-work flex flex-column">
        <div class="payment flex">
          <div class="input flex flex-column">
            <label for="invoiceDate">Inovice Date</label>
            <input v-model="invoiceDate" id="invoiceDate" type="text" />
          </div>
          <div class="input flex flex-column">
            <label for="paymentDueDate">Payment Due</label>
            <input
              v-model="paymentDueDate"
              id="paymentDueDate"
              type="text"
              required
            />
          </div>
        </div>
        <div class="input flex flex-column">
          <label for="paymentTerms">Payment Terms</label>
          <select required v-model="paymentTerms" id="paymentTerms" type="text">
            <option value="30">Net 30 Days</option>
            <option value="60">Net 60 Days</option>
          </select>
        </div>
        <div class="input flex flex-column">
          <label for="productDescription">Product Description</label>
          <input
            v-model="productDescription"
            id="productDescription"
            type="text"
          />
        </div>

        <div class="work-items">
          <h3>Item List</h3>
          <table class="item-list">
            <tr class="table-heading flex">
              <th class="item-name">Item Name</th>
              <th class="qty">Qty</th>
              <th class="price">Price</th>
              <th class="total">Total</th>
            </tr>

            <tr
              class="table-items flex"
              v-for="(item, index) in invoiceItemList"
              :key="index"
            >
              <td class="item-name">
                <input type="text" v-model="item.itemName" />
              </td>
              <td class="qty"><input type="text" v-model="item.qty" /></td>
              <td class="price">
                <input type="text" v-model="item.price" />
              </td>
              <td class="total flex">
                ${{ (item.total = item.qty * item.price) }}
              </td>
              <img
                @click="deleteInvoice(item.id)"
                src="@/assets/icon-delete.svg"
              />
            </tr>
          </table>
          <div @click="addNewInvoiceItem" class="flex button">
            <img src="@/assets/icon-plus.svg" alt="" />
            Add New Item
          </div>
        </div>
      </div>

      <!-- Save/exit -->
      <div class="save flex">
        <div class="left">
          <button type="button" @click="closeInvoice" class="red">
            Cancel
          </button>
        </div>
        <div class="right flex">
          <button
            v-if="!editInvoice"
            type="submit"
            @click="saveDraft"
            class="dark-purple"
          >
            Save Draft
          </button>
          <button
            v-if="!editInvoice"
            type="submit"
            @click="publishInvoice"
            class="purple"
          >
            Create Invoice
          </button>
          <button
            v-if="editInvoice"
            type="submit"
            @click="publishInvoice"
            class="purple"
          >
            Update Invoice
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import LoadingComp from "@/components/Loading.vue";
import { mapActions, mapMutations, mapState } from "vuex";
import { uid } from "uid";
import db from "../firebase/firebaseInit.js";
import { doc, collection, addDoc, updateDoc } from "firebase/firestore";

export default {
  name: "invoiceModal",
  components: { LoadingComp },
  data() {
    return {
      dateOptions: { year: "numeric", month: "short", day: "numeric" },
      docId: null,
      loading: null,
      billerStreetAddress: null,
      billerCity: null,
      billerZipCode: null,
      billerCountry: null,
      clientName: null,
      clientEmail: null,
      clientStreetAddress: null,
      clientCity: null,
      clientZipCode: null,
      clientCountry: null,
      invoiceDateUnix: null,
      invoiceDate: null,
      paymentTerms: null,
      paymentDueDateUnix: null,
      paymentDueDate: null,
      productDescription: null,
      invoicePending: null,
      invoiceDraft: null,
      invoiceItemList: [],
      invoiceTotal: 0,
    };
  },

  computed: {
    ...mapState(["editInvoice", "currentInvoiceArray"]),
  },

  watch: {
    paymentTerms() {
      const futureDate = new Date();
      this.paymentDueDateUnix = futureDate.setDate(
        futureDate.getDate() + parseInt(this.paymentTerms)
      );

      this.paymentDueDate = new Date(
        this.paymentDueDateUnix
      ).toLocaleDateString("en-us", this.dateOptions);
    },
  },

  methods: {
    ...mapMutations(["TOGGLE_INVOICE", "TOGGLE_MODAL", "TOGGLE_EDIT_INVOICE"]),

    ...mapActions(["UPDATE_INVOICE", "GET_INVOICES"]),

    checkClick(e) {
      if (e.target === this.$refs.invoiceWrap) {
        this.TOGGLE_MODAL();
      }
    },

    closeInvoice() {
      this.TOGGLE_INVOICE();
      if (this.editInvoice) {
        this.TOGGLE_EDIT_INVOICE();
      }
    },

    addNewInvoiceItem() {
      this.invoiceItemList.push({
        id: uid(),
        itemName: "",
        qty: "",
        price: 0,
        total: 0,
      });
    },

    deleteInvoice(id) {
      this.invoiceItemList = this.invoiceItemList.filter(
        (item) => item.id !== id
      );
    },

    callInvoiceTotal() {
      this.invoiceTotal = 0;
      this.invoiceItemList.forEach((item) => {
        this.invoiceTotal += item.total;
      });
    },

    saveDraft() {
      this.invoiceDraft = true;
    },

    publishInvoice() {
      this.invoicePending = true;
    },

    async uploadInvoice() {
      if (this.invoiceItemList.length <= 0) {
        alert("Please ensure you filled out work items!");
        return;
      }

      this.loading = true;

      this.callInvoiceTotal();

      const dataBase = collection(db, "invoices");

      const dataObj = {
        invoiceId: uid(6),
        billerStreetAddress: this.billerStreetAddress,
        billerCity: this.billerCity,
        billerZipCode: this.billerZipCode,
        billerCountry: this.billerCountry,
        clientName: this.clientName,
        clientEmail: this.clientEmail,
        clientStreetAddress: this.clientStreetAddress,
        clientCity: this.clientCity,
        clientZipCode: this.clientZipCode,
        clientCountry: this.clientCountry,
        paymentTerms: this.paymentTerms,
        paymentDueDate: this.paymentDueDate,
        paymentDueDateUnix: this.paymentDueDateUnix,
        productDescription: this.productDescription,
        invoiceItemList: this.invoiceItemList,
        invoiceTotal: this.invoiceTotal,
        invoicePending: this.invoicePending,
        invoiceDraft: this.invoiceDraft,
        invoicePaid: null,
        invoiceDateUnix: this.invoiceDateUnix,
        invoiceDate: this.invoiceDate,
      };

      await addDoc(dataBase, dataObj);

      this.TOGGLE_INVOICE();
      this.GET_INVOICES();

      this.loading = false;
    },

    async updateInvoice() {
      if (this.invoiceItemList.length <= 0) {
        alert("Please ensure you filled out work items!");
        return;
      }

      this.loading = true;

      this.callInvoiceTotal();

      const dataBase = doc(db, "invoices", this.docId);

      const dataObj = {
        billerStreetAddress: this.billerStreetAddress,
        billerCity: this.billerCity,
        billerZipCode: this.billerZipCode,
        billerCountry: this.billerCountry,
        clientName: this.clientName,
        clientEmail: this.clientEmail,
        clientStreetAddress: this.clientStreetAddress,
        clientCity: this.clientCity,
        clientZipCode: this.clientZipCode,
        clientCountry: this.clientCountry,
        paymentTerms: this.paymentTerms,
        paymentDueDate: this.paymentDueDate,
        paymentDueDateUnix: this.paymentDueDateUnix,
        productDescription: this.productDescription,
        invoiceItemList: this.invoiceItemList,
        invoiceTotal: this.invoiceTotal,
        invoiceDateUnix: this.invoiceDateUnix,
        invoiceDate: this.invoiceDate,
      };

      await updateDoc(dataBase, dataObj);

      this.loading = false;

      const data = {
        docId: this.docId,
        routeId: this.$route.params.invoiceId,
      };

      this.UPDATE_INVOICE(data);
    },

    submitForm() {
      if (this.editInvoice) {
        this.updateInvoice();
        return;
      } else {
        this.uploadInvoice();
      }
    },

    autoFill() {
      this.invoiceId = uid(6);
      this.billerStreetAddress = "Nilo peçanha";
      this.billerCity = "Joaçaba";
      this.billerZipCode = "89610000";
      this.billerCountry = "Brazil";
      this.clientName = "Fulano de tal";
      this.clientEmail = "Fulano de tal @gmail.com";
      this.clientStreetAddress = "Alguma rua";
      this.clientCity = "Hoaçaba";
      this.clientZipCode = "89584000";
      this.clientCountry = "Brazil";
      this.paymentTerms = "30";
      this.paymentDueDate = "Oct 29 2023";
      this.paymentDueDateUnix = "Oct 29 2023";
      this.productDescription = "this.productDescription";
      this.invoiceItemList = [];
      this.invoiceTotal = "25";
      this.invoicePending = true;
      this.invoiceDraft = false;
      this.invoicePaid = null;
    },
    getCurrentDate() {},
  },

  created() {
    if (!this.editInvoice) {
      // Get current date
      this.invoiceDateUnix = Date.now();
      this.invoiceDate = new Date(this.invoiceDateUnix).toLocaleDateString(
        "en-us",
        this.dateOptions
      );
    }

    if (this.editInvoice) {
      const currentInvoice = this.currentInvoiceArray[0];

      this.docId = currentInvoice.docId;
      this.billerStreetAddress = currentInvoice.billerStreetAddress;
      this.billerCity = currentInvoice.billerCity;
      this.billerZipCode = currentInvoice.billerZipCode;
      this.billerCountry = currentInvoice.billerCountry;
      this.clientName = currentInvoice.clientName;
      this.clientEmail = currentInvoice.clientEmail;
      this.clientStreetAddress = currentInvoice.clientStreetAddress;
      this.clientCity = currentInvoice.clientCity;
      this.clientZipCode = currentInvoice.clientZipCode;
      this.clientCountry = currentInvoice.clientCountry;
      this.invoiceDateUnix = currentInvoice.invoiceDateUnix;
      this.invoiceDate = currentInvoice.invoiceDate;
      this.paymentTerms = currentInvoice.paymentTerms;
      this.paymentDueDateUnix = currentInvoice.paymentDueDateUnix;
      this.paymentDueDate = currentInvoice.paymentDueDate;
      this.productDescription = currentInvoice.productDescription;
      this.invoicePending = currentInvoice.invoicePending;
      this.invoiceDraft = currentInvoice.invoiceDraft;
      this.invoiceItemList = currentInvoice.invoiceItemList;
      this.invoiceTotal = currentInvoice.invoiceTotal;
    }
  },
};
</script>

<style lang="scss" scoped>
.invoice-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  @media (min-width: 900px) {
    left: 90px;
  }

  .invoice-content {
    position: relative;
    padding: 56px;
    max-width: 700px;
    width: 100%;
    background-color: #141625;
    color: #fff;
    box-shadow: 10px 4px 6px -1px rgba(0, 0, 0, 0.2),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);

    h1 {
      margin-bottom: 48px;
      color: #fff;
    }

    h3 {
      margin-bottom: 16px;
      font-size: 18px;
      color: #777f98;
    }

    h4 {
      color: #7c5dfa;
      font-size: 12px;
      margin-bottom: 24px;
    }

    // Bill To / Bill From
    .bill-to,
    .bill-from {
      margin-bottom: 48px;

      .location-details {
        gap: 16px;
        div {
          flex: 1;
        }
      }
    }

    // Invoice Work

    .invoice-work {
      .payment {
        gap: 24px;
        div {
          flex: 1;
        }
      }

      .work-items {
        .item-list {
          width: 100%;

          // Item Table Styling
          .table-heading,
          .table-items {
            gap: 16px;
            font-size: 12px;

            .item-name {
              flex-basis: 50%;
            }

            .qty {
              flex-basis: 10%;
            }

            .price {
              flex-basis: 20%;
            }

            .total {
              flex-basis: 20%;
              align-self: center;
            }
          }

          .table-heading {
            margin-bottom: 16px;

            th {
              text-align: left;
            }
          }

          .table-items {
            position: relative;
            margin-bottom: 24px;

            img {
              position: absolute;
              top: 15px;
              right: 0;
              width: 12px;
              height: 16px;
            }
          }
        }

        .button {
          color: #fff;
          background-color: #252945;
          align-items: center;
          justify-content: center;
          width: 100%;

          img {
            margin-right: 4px;
          }
        }
      }
    }

    .save {
      margin-top: 60px;

      div {
        flex: 1;
      }

      .right {
        justify-content: flex-end;
      }
    }
  }

  .input {
    margin-bottom: 24px;
  }

  label {
    font-size: 12px;
    margin-bottom: 6px;
  }

  input,
  select {
    width: 100%;
    background-color: #1e2139;
    color: #fff;
    border-radius: 4px;
    padding: 12px 4px;
    border: none;

    &:focus {
      outline: none;
    }
  }
}
</style>