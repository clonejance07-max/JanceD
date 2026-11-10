export interface Hexagram {
  name: string;
  symbol: string;
  meaning: string;
  advice: string;
}

export const HEXAGRAMS: Hexagram[] = [
  {
    name: "Quẻ số 1 - Thuần Càn",
    symbol: "䷀",
    meaning: "Trời mang tính dương cương mạnh mẽ, chủ động và kiêu hãnh.",
    advice: "Đại cát. Mọi việc đều hanh thông, thuận lợi. Tuy nhiên cần giữ thái độ khiêm nhường, tránh kiêu ngạo để giữ được sự bền vững lâu dài."
  },
  {
    name: "Quẻ số 2 - Thuần Khôn",
    symbol: "䷁",
    meaning: "Đất mang tính âm nhu, bao dung, tiếp nhận và vâng phục.",
    advice: "Đại cát. Hãy hành động với sự bao dung, mềm mỏng và kiên nhẫn. Lắng nghe người khác sẽ mang lại lợi ích lớn lao hơn là tranh giành."
  },
  {
    name: "Quẻ số 3 - Thủy Lôi Truân",
    symbol: "䷂",
    meaning: "Gian nan lúc khởi đầu giống như mầm non vượt qua lớp đất cứng.",
    advice: "Vạn sự khởi đầu nan. Hãy giữ vững ý chí và kiên trì nhẫn nại. Qua được giai đoạn khó khăn ban đầu, mọi thứ sẽ dần trở nên xán lạn."
  },
  {
    name: "Quẻ số 4 - Sơn Thủy Mông",
    symbol: "䷃",
    meaning: "Sương mù che phủ chân núi, sự non nớt và mông lung cần dẫn dắt.",
    advice: "Khi chưa hiểu rõ vấn đề, đừng hành động vội vàng. Hãy tìm kiếm sự chỉ dẫn từ người đi trước hoặc những người có kinh nghiệm."
  },
  {
    name: "Quẻ số 10 - Thiên Trạch Lý",
    symbol: "䷉",
    meaning: "Đi sau đuôi cọp, bước đi đầy mạo hiểm nhưng cực kỳ khéo léo.",
    advice: "Cẩn trọng trong từng hành động và lời nói. Dù ở trong hoàn cảnh nguy hiểm nhưng nếu biết giữ đúng lễ nghĩa và sự kính trọng, sẽ vượt qua bình an."
  },
  {
    name: "Quẻ số 11 - Địa Thiên Thái",
    symbol: "䷊",
    meaning: "Trời đất giao hòa, vạn vật hanh thông, thái bình thịnh vượng.",
    advice: "Thời vận vô cùng tốt đẹp. Mọi sự bình an, hòa hợp. Đây là lúc thích hợp để phát triển các mối quan hệ và tiến hành những việc quan trọng."
  },
  {
    name: "Quẻ số 12 - Thiên Địa Bĩ",
    symbol: "䷋",
    meaning: "Trời đất không giao hòa, bế tắc, cô lập và thờ ơ.",
    advice: "Giai đoạn khó khăn, bế tắc. Không nên mạo hiểm tiến lên. Hãy ẩn mình chờ đợi, giữ gìn phẩm chất và chờ thời cơ tốt hơn."
  },
  {
    name: "Quẻ số 13 - Thiên Hỏa Đồng Nhân",
    symbol: "䷌",
    meaning: "Cùng chung chí hướng, sự đồng điệu tâm hồn giữa dòng người.",
    advice: "Cát lợi khi hợp tác và kết giao. Hãy mở rộng lòng mình, đoàn kết với những người có cùng chí hướng, mọi việc sẽ đạt được thành tựu lớn."
  },
  {
    name: "Quẻ số 14 - Hỏa Thiên Đại Hữu",
    symbol: "䷍",
    meaning: "Lửa sáng trên trời, sự sở hữu rộng lớn và sung túc vô bờ.",
    advice: "Thời kỳ sung túc và dồi dào. Nhưng hãy nhớ chia sẻ và giúp đỡ người khác, đừng giữ sự ích kỷ, như vậy may mắn mới lâu bền."
  },
  {
    name: "Quẻ số 15 - Địa Sơn Khiêm",
    symbol: "䷎",
    meaning: "Núi ẩn mình dưới đất sâu, sự nhún nhường và tự tôn vô hình.",
    advice: "Sự khiêm tốn mang lại phước lành. Dù có tài năng hay thành tựu, hãy biết nhún nhường, tránh khoe khoang. Mọi sự sẽ bình an và được nể trọng."
  },
  {
    name: "Quẻ số 31 - Trạch Sơn Hàm",
    symbol: "䷞",
    meaning: "Hồ nước trên đỉnh núi, sự cảm ứng rung động và hút nhau mãnh liệt.",
    advice: "Sự thấu cảm và chân thành sẽ kết nối trái tim. Đừng dùng thủ đoạn, hãy tiếp cận mọi việc bằng sự đồng cảm và tấm lòng thành thật."
  },
  {
    name: "Quẻ số 44 - Thiên Phong Cấu",
    symbol: "䷫",
    meaning: "Gió thổi dưới gầm trời, sự gặp gỡ bất ngờ mang đầy duyên nợ.",
    advice: "Cẩn thận với những sự kiện hoặc mối quan hệ bất ngờ. Không phải sự gặp gỡ nào cũng mang lại điều tốt, hãy giữ sự tỉnh táo và phán đoán đúng đắn."
  },
  {
    name: "Quẻ số 54 - Lôi Trạch Quy Muội",
    symbol: "䷵",
    meaning: "Sấm sét trên hồ nước, tiến lên một cách vội vã, không hợp thứ tự.",
    advice: "Đừng quá vội vàng tiến tới mà quên đi những quy tắc và sự chuẩn bị cần thiết. Hành động nôn nóng lúc này có thể dẫn đến hậu quả không mong muốn."
  }
];
