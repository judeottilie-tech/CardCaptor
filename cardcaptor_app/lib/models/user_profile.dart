class UserProfile {
  final int id;
  final String displayName;
  final String userName;
  final String identityUserId;

  UserProfile({
    required this.id,
    required this.displayName,
    required this.userName,
    required this.identityUserId,
  });

  factory UserProfile.fromJson(Map<String, dynamic> json) {
    return UserProfile(
      id: json['id'],
      displayName: json['displayName'] ?? '',
      userName: json['userName'] ?? '',
      identityUserId: json['identityUserId'] ?? '',
    );
  }
}
