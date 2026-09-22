const baseUrl = "http://localhost:3000";

// Sửa token này thành token hợp lệ của Manager
const MANAGER_TOKEN = "ĐIỀN_TOKEN_MANAGER_VÀO_ĐÂY";

// ID của Request đang ở trạng thái NEW (Ví dụ: ID = 1)
const REQUEST_ID = 1;

async function testConcurrency() {
  console.log(`Bắt đầu giả lập 2 Manager cùng lúc gán Request #${REQUEST_ID}...`);

  const requestOptions = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${MANAGER_TOKEN}`,
    },
    // Gán cho Technician có ID = 2
    body: JSON.stringify({ technicianId: 2 }),
  };

  const url = `${baseUrl}/requests/${REQUEST_ID}/assign`;

  // Gửi 2 request CÙNG LÚC (Concurrent) bằng Promise.all
  const [res1, res2] = await Promise.all([
    fetch(url, requestOptions),
    fetch(url, requestOptions),
  ]);

  const body1 = await res1.json();
  const body2 = await res2.json();

  console.log("=== KẾT QUẢ REQUEST 1 ===");
  console.log(`Status: ${res1.status}`);
  console.log("Body:", body1);

  console.log("\n=== KẾT QUẢ REQUEST 2 ===");
  console.log(`Status: ${res2.status}`);
  console.log("Body:", body2);
}

testConcurrency().catch(console.error);
