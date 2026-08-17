import 'binder_page_card_slot.dart';

class BinderPage {
  final int id;
  final String title;
  final String? description;
  final int userProfileId;
  final DateTime createdAt;
  final List<BinderPageCardSlot>? slots;

  BinderPage({
    required this.id,
    required this.title,
    this.description,
    required this.userProfileId,
    required this.createdAt,
    this.slots,
  });

  factory BinderPage.fromJson(Map<String, dynamic> json) {
    return BinderPage(
      id: json['id'],
      title: json['title'] ?? '',
      description: json['description'],
      userProfileId: json['userProfileId'],
      createdAt: DateTime.tryParse(json['createdAt'] ?? '') ?? DateTime.now(),
      slots: json['binderPageCardSlots'] != null
          ? (json['binderPageCardSlots'] as List<dynamic>)
              .map((s) => BinderPageCardSlot.fromJson(s))
              .toList()
          : null,
    );
  }
}
