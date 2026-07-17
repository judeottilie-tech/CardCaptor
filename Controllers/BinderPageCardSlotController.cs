using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text;
using CardCaptor.Models;
using CardCaptor.Models.DTOs;
using CardCaptor.Data;
using Microsoft.EntityFrameworkCore;

namespace CardCaptor.Controllers;

//put /api/bindercardslot/{id}/card //allows add replace of card in slot

//delete /api/bindercardslot/{id}/card // clears the slot