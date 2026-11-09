# A1 Documentation Archive Provenance

## Source

- Source annotated tag: `A1-final`
- Source peeled commit: `1951dc124c83359556f04adb6ba3f0ee9f22fce4`
- Source tree: `A1-final:docs/`
- Original A1 document count: **58**

This directory is a process-immutable snapshot of the A1 `docs/` tree. Its 58
archived files were materialized directly from Git objects at the commit above,
not copied from the current working tree. Future changes must not alter their
contents, paths, or names; A2 documentation belongs outside this archive.

## Verification method

The source inventory was obtained with:

```text
git ls-tree -r 1951dc124c83359556f04adb6ba3f0ee9f22fce4 -- docs
```

After materialization, each archive file is verified by computing its Git blob
hash from its on-disk bytes (`git hash-object <file>`) and comparing it to the
source blob ID below. The relative path list is also compared one-for-one. This
checks original bytes, including binary DOCX, PDF, and SVG artifacts, without
text or line-ending normalization.

## Source file inventory

Format: `mode | Git blob ID | path relative to A1 docs/`.

```text
100644 | a674296e944180a74ecdfdff7cc50c2cc64a0ad0 | BrewLite_Finalize_Product_Data_Model.docx
100644 | 205ec3dd7ea060aeac811ff34a5e4e90c0428103 | BrewLite_Phase2_Project_Report_Draft.md
100644 | c042a20b68ad3858be09ed2ff66922f98758155c | BrewLite_Project_Charter.docx
100644 | 68fd1ff966ee20b0dd0739a489213ecbb4b91381 | BrewLite_Requirements_Specification.docx
100644 | 06f5c8edd89aa0d3ae666d07dc0e864d4a8ad31f | BrewLite_Requirements_Specification_v3.1.docx
100644 | 3062aa87d8b06348c6a0256484915c8a1fa174f1 | BrewLite_Techstack.docx
100644 | 99016d9ee219f5c8e99684497dd5615b5f169687 | BrewLite_Use_Case_Specification.docx
100644 | 5a1a3331427e941eafb211df6e6813355f01974a | BrewLite_User_Stories_Acceptance_Criteria.docx
100644 | 4e4f13f5dc1f50b97853aac10819829122ef05d8 | Docker_Compose.md
100644 | c769283dc580e1b20bcd1b8cc3502d57347507fe | UIUX_Design/BrewLite_UI_Design.pdf
100644 | a68579115fb583f5a40fc1335cb5db5fc04f1ff0 | api/BrewLite_API_Contract_v1.0.md
100644 | df1a9fdd14c533619b8ca67a5a8c5b0b3f4dd7d7 | api/BrewLite_API_Contract_v2.0.md
100644 | c34904e51ff36760ce95066e731856eafe9221fb | api/BrewLite_API_Contract_v2.1.md
100644 | c27c38b3711ca527c2e5e2e6036c8ebb187632a5 | api/BrewLite_API_Contract_v3.0.md
100644 | 9193e2a3fa3a61da65e4535e07c2853545e35de9 | api/BrewLite_API_Contract_v4.0.md
100644 | fea038713243f9aceef4c9080e5c3f0c67840697 | api/Product_Detail_Implementation.md
100644 | 17d4b6f4b219a6aa15dfdb5a942bac3c27aee303 | api/SCRUM39_Handoff.md
100644 | 037b57629cf405e011ff8be8825d08656b95e67d | api/SCRUM54_Payment_Implementation.md
100644 | 39e01fe4a9e0646ba8a8274f9187e275a20de19e | api/SCRUM55_Payment_Idempotency.md
100644 | 49a964ddd5c525571598cedad855cc836564bfcb | api/SCRUM57_Order_State_Machine.md
100644 | fe270b43ea41f1f3e50a865dd8a1242200815717 | api/SCRUM58_Inventory_Concurrency.md
100644 | fbe70d158b55030901a9ab32a317e70df6d87017 | api/SCRUM59_Order_Payment_Lifecycle.md
100644 | 69c8704f0f6bf247e6c3b8b083506aac000254d0 | api/SCRUM84_Zero_Amount_Payment.md
100644 | 6eafd35c1ca4af4bf0591809f708787110add3e4 | api/SCRUM85_Mock_Payment_Environment_Access_Policy.md
100644 | a09019fe571887df5f89c1a747cfb945f68300b4 | api/SCRUM96_Coupon_Preview_Addendum.md
100644 | ac19b784691c2972adbb2418862950901e326d8f | decisions/ADR-P2-QueryDR-Sandbox-E2E-Deferred.md
100644 | 58ff56c40ccdc484877d234d5523e61482a3eb5d | decisions/VNPay_Phase2_Change_Request.md
100644 | 11b831b3d342496d1b46b7efb79a06d54cf8673f | design/payment/BrewLite_Payment_Architecture_Phase2_v1.0.md
100644 | f0f74ad3e8b536412e7cd83b45afb40e0659d2b6 | design/payment/Payment_Finalization_Concurrency_Test_Handoff_SCRUM-79.md
100644 | 689f2166fda3d9d2ddc8747906b384bcdff59494 | design/payment/Shared_Payment_Finalization_Handoff_SCRUM-78.md
100644 | e69de29bb2d1d6434b8b29ae775ad8c2e48c5391 | diagram/.gitkeep
100644 | ebf14321db6b5a3fd3e2870a6b51cdd45108d695 | diagram/Activity-Final.drawio.svg
100644 | 3b3c87af1b288f744815d1f3adbe13e27db075ed | diagram/ERD/ERD.pdf
100644 | 6fa4f32f6e1daa5f29431b8720ba64e6aada62c1 | diagram/Sequence/Sequence_Brewlite-Page-1.drawio.svg
100644 | ca5216aec4cf1044d4075e17e807e96ec4631389 | diagram/Sequence/Sequence_Brewlite-Page-2.drawio.svg
100644 | d39a27cd58aa3b5e863903dba42ac893107dc50c | diagram/Sequence/Sequence_Brewlite-Page-3.drawio.svg
100644 | 841d18f7947c1d5da3dc333d1cdce7eb224508e3 | diagram/Sequence/Sequence_Brewlite-Page-4.drawio.svg
100644 | 6e91bda8032b5b9ce16bc24088bb364be992796c | diagram/Sequence/Sequence_Brewlite-Page-5.drawio.svg
100644 | fcdfa2c8a20d39980c8a192c16b315f83a26a43c | diagram/Sequence/Sequence_Brewlite-Page-6.drawio.svg
100644 | 7fec6a3171cf6619f3ed32d07155c68a5f373c02 | diagram/UseCase_Diagram.drawio.svg
100644 | 4f7e2ab92decffb3d68756eea73f1dd2b0dfe4ba | docs_Phase2/BrewLite_ERD_Prisma_Delta_Phase2_v0.2.2_CK-R01-R03_UPDATED.md
100644 | 06f5c8edd89aa0d3ae666d07dc0e864d4a8ad31f | docs_Phase2/BrewLite_Requirements_Specification_v3.1.docx
100644 | f8826b184b3f7001787decd55e97b9ff429b5816 | docs_Phase2/BrewLite_Use_Case_Specification_v3.1_VNPay_Phase_2 .pdf
100644 | 5ff01fc01cb8d03fb9abf40f45742113c9b51f0d | docs_Phase2/BrewLite_User_Stories_Acceptance_Criteria_Phase2.docx
100644 | 22fe6feed6688c3e28e07846c42363b4d8dd36f7 | docs_Phase2/schema_phase2_proposed_v0.2.2_CK-R01-R03_UPDATED.dbml
100644 | 06ad553977f2c0d4aa1789f804cef13ce110bcd3 | integration/VNPay_Sandbox_Setup.md
100644 | 4661758e90b7e597f364f713bafdd59a61351e00 | verification/SCRUM80_Payment_Migration_Runbook.md
100644 | 3c6d50d1b770b2aacdace9a1c85be63f900ac6a3 | verification/SCRUM80_Payment_Migration_Verification.md
100644 | c29ef7d2e1c51dbdbad05d1de8ae96010da0d9b1 | verification/SCRUM82_Payment_Reconciliation_Scheduler.md
100644 | 4fcf1f613dcb609e1180b8c1fa67f41b00c51864 | verification/SCRUM92_Docker_Clean_Setup_Verification.md
100644 | efa8864d302582ce5a836b1b15a2205460d6ba4e | verification/SCRUM94_Browser_Screenshot_Blocked_Safe.log
100644 | 9d5ed2e51b65c3b07a66ceff85d262b7ccfae127 | verification/SCRUM94_Compose_Verifier_PostSync_Safe.log
100644 | ba8bf3f2e77a6cc073199b3c0c95c64f365cfd8f | verification/SCRUM94_Concurrency_Test_Safe.log
100644 | 3d8f6c4efa2866024bea8ddd549a071791cea294 | verification/SCRUM94_DevSync_Verification_Safe.log
100644 | fb1a18b028534d71482c8bcc3e8cbd0d0b5ad076 | verification/SCRUM94_Docker_Default_Safe.log
100644 | 2e406730f119a184a5414de172eaa67fe5b7e1fb | verification/SCRUM94_Runtime_Smoke_Safe.log
100644 | 5d60fe7e2702fd9a110c64dd2f051622a8d885cd | verification/SCRUM94_SCRUM69_Test_Safe.log
100644 | eededfa2bc6001d56f512773d6cfaa5066026783 | verification/SCRUM94_Verification_Evidence.md
```
